"use client";

import React, { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  ArrowUpRight,
  CheckCircle2,
  Edit3,
  FolderKanban,
  Image as ImageIcon,
  Link2,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import {
  ADMIN_EMAIL,
  auth,
  isPortfolioOwner,
  signInWithGoogle,
  signOutUser,
  testConnection,
} from "@/lib/firebase-client";
import {
  LINK_GROUPS,
  LinkGroup,
  MEDIA_CATEGORIES,
  MediaCategory,
  MediaItemRecord,
  PortfolioLinkRecord,
  PortfolioSnapshot,
  PROJECT_CATEGORIES,
  ProjectCategory,
  ProjectRecord,
} from "@/lib/portfolio-types";
import MinimalHeader from "./MinimalHeader";
import SmartMedia from "./SmartMedia";

interface AdminStudioProps {
  initialData: PortfolioSnapshot;
}

type StudioTab = "projects" | "links" | "media" | "profile";

async function compressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a PNG, JPG, WebP, or GIF image file.");
  }

  // Keep animated GIFs intact if already under 450KB
  if (file.type === "image/gif") {
    if (file.size > 450 * 1024) {
      throw new Error("Animated GIFs must be under 450 KB.");
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read GIF file."));
      reader.readAsDataURL(file);
    });
  }

  const imageBitmap = await createImageBitmap(file);
  const maxWidth = 1200;
  const scale = imageBitmap.width > maxWidth ? maxWidth / imageBitmap.width : 1;
  const width = Math.round(imageBitmap.width * scale);
  const height = Math.round(imageBitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas image processing is unavailable.");
  }
  ctx.drawImage(imageBitmap, 0, 0, width, height);

  let dataUrl = canvas.toDataURL("image/webp", 0.82);
  if (dataUrl.length > 520000) {
    dataUrl = canvas.toDataURL("image/jpeg", 0.72);
  }
  if (dataUrl.length > 580000) {
    throw new Error("Compressed image exceeds 420 KB limit. Please choose a smaller file.");
  }
  return dataUrl;
}

export default function AdminStudio({ initialData }: AdminStudioProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [snapshot, setSnapshot] = useState<PortfolioSnapshot>(initialData);
  const [activeTab, setActiveTab] = useState<StudioTab>("projects");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [autoSeeded, setAutoSeeded] = useState(false);

  // Project form state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState("");
  const [projYear, setProjYear] = useState(String(new Date().getFullYear()));
  const [projCategory, setProjCategory] = useState<ProjectCategory>("web-app");
  const [projUrl, setProjUrl] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projImageUrl, setProjImageUrl] = useState("");
  const [projFeatured, setProjFeatured] = useState(false);
  const [projOrder, setProjOrder] = useState(1);

  // Link form state
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkGroup, setLinkGroup] = useState<LinkGroup>("social");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkImageUrl, setLinkImageUrl] = useState("");
  const [linkDescription, setLinkDescription] = useState("");
  const [linkOrder, setLinkOrder] = useState(1);

  // Media form state
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaCategory, setMediaCategory] =
    useState<MediaCategory>("social-marketing");
  const [mediaSrc, setMediaSrc] = useState("");
  const [mediaAlt, setMediaAlt] = useState("");
  const [mediaLinkUrl, setMediaLinkUrl] = useState("");
  const [mediaOrder, setMediaOrder] = useState(1);

  // Profile form state
  const [profName, setProfName] = useState(initialData.profile.name);
  const [profLocation, setProfLocation] = useState(initialData.profile.location);
  const [profHeadline, setProfHeadline] = useState(initialData.profile.headline);
  const [profSubheadline, setProfSubheadline] = useState(
    initialData.profile.subheadline
  );
  const [profHeroImage, setProfHeroImage] = useState(initialData.profile.heroImage);
  const [profHeroCaption, setProfHeroCaption] = useState(
    initialData.profile.heroCaption || ""
  );
  const [profResumeUrl, setProfResumeUrl] = useState(initialData.profile.resumeUrl);
  const [profAssessmentUrl, setProfAssessmentUrl] = useState(
    initialData.profile.assessmentUrl
  );

  const refreshPortfolio = useCallback(async () => {
    const res = await fetch("/api/portfolio", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as PortfolioSnapshot;
      setSnapshot(data);
      setProfName(data.profile.name);
      setProfLocation(data.profile.location);
      setProfHeadline(data.profile.headline);
      setProfSubheadline(data.profile.subheadline);
      setProfHeroImage(data.profile.heroImage);
      setProfHeroCaption(data.profile.heroCaption || "");
      setProfResumeUrl(data.profile.resumeUrl);
      setProfAssessmentUrl(data.profile.assessmentUrl);
    }
  }, []);

  useEffect(() => {
    void testConnection();
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      if (nextUser && !isPortfolioOwner(nextUser)) {
        void signOutUser();
        setUser(null);
        setAuthReady(true);
        setNotice({
          type: "err",
          text: "Access denied. Only the verified portfolio owner account is permitted to sign in.",
        });
        return;
      }
      setUser(nextUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const getToken = useCallback(async (): Promise<string> => {
    if (!auth.currentUser) {
      throw new Error("Please sign in first.");
    }
    return auth.currentUser.getIdToken();
  }, []);

  const syncSeedToDatabase = useCallback(
    async (quiet = false) => {
      try {
        setBusy(true);
        const token = await getToken();
        const res = await fetch("/api/seed", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = (await res.json()) as {
          seededCount?: number;
          seededProfile?: boolean;
          error?: string;
        };
        if (!res.ok) {
          throw new Error(body.error || "Failed to initialize database.");
        }
        await refreshPortfolio();
        if (!quiet || (body.seededCount ?? 0) > 0 || body.seededProfile) {
          setNotice({
            type: "ok",
            text:
              (body.seededCount ?? 0) > 0 || body.seededProfile
                ? `Synced ${body.seededCount ?? 0} portfolio records to Firestore.`
                : "Database is already up to date.",
          });
        }
      } catch (err) {
        if (!quiet) {
          setNotice({
            type: "err",
            text: err instanceof Error ? err.message : "Database sync failed.",
          });
        }
      } finally {
        setBusy(false);
      }
    },
    [getToken, refreshPortfolio]
  );

  // Automatically persist starting portfolio records into Firestore on first owner sign-in
  useEffect(() => {
    if (!authReady || !isPortfolioOwner(user) || autoSeeded) return;
    const { fromDatabase } = snapshot;
    if (
      !fromDatabase.profile ||
      !fromDatabase.projects ||
      !fromDatabase.links ||
      !fromDatabase.media
    ) {
      setAutoSeeded(true);
      void syncSeedToDatabase(true);
    }
  }, [authReady, user, snapshot, autoSeeded, syncSeedToDatabase]);

  const handleSignIn = async () => {
    setNotice(null);
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof Error ? err.message : "Sign-in cancelled or failed.",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setNotice(null);
    await signOutUser();
  };

  // --- Project handlers ---
  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjTitle("");
    setProjYear(String(new Date().getFullYear()));
    setProjCategory("web-app");
    setProjUrl("");
    setProjDescription("");
    setProjImageUrl("");
    setProjFeatured(false);
    setProjOrder(snapshot.projects.length + 1);
  };

  const startEditProject = (p: ProjectRecord) => {
    setEditingProjectId(p.id);
    setProjTitle(p.title);
    setProjYear(p.year);
    setProjCategory(p.category);
    setProjUrl(p.url);
    setProjDescription(p.description || "");
    setProjImageUrl(p.imageUrl || "");
    setProjFeatured(p.featured);
    setProjOrder(p.sortOrder ?? 1);
    setNotice(null);
  };

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setBusy(true);
    try {
      const token = await getToken();
      const payload = {
        title: projTitle,
        year: projYear,
        category: projCategory,
        url: projUrl,
        description: projDescription,
        imageUrl: projImageUrl,
        featured: projFeatured,
        sortOrder: Number(projOrder) || 0,
      };
      const endpoint = editingProjectId
        ? `/api/projects/${editingProjectId}`
        : "/api/projects";
      const method = editingProjectId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Unable to save project.");

      await refreshPortfolio();
      setNotice({
        type: "ok",
        text: editingProjectId ? "Project updated." : "Project added.",
      });
      resetProjectForm();
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to save project.",
      });
    } finally {
      setBusy(false);
    }
  };

  const deleteProject = async (id: string, title: string) => {
    setNotice(null);
    setBusy(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Unable to delete project.");
      await refreshPortfolio();
      if (editingProjectId === id) resetProjectForm();
      setNotice({ type: "ok", text: `Deleted "${title}".` });
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to delete project.",
      });
    } finally {
      setBusy(false);
    }
  };

  // --- Link handlers ---
  const resetLinkForm = () => {
    setEditingLinkId(null);
    setLinkLabel("");
    setLinkGroup("social");
    setLinkUrl("");
    setLinkImageUrl("");
    setLinkDescription("");
    setLinkOrder(snapshot.links.length + 1);
  };

  const startEditLink = (l: PortfolioLinkRecord) => {
    setEditingLinkId(l.id);
    setLinkLabel(l.label);
    setLinkGroup(l.group);
    setLinkUrl(l.url);
    setLinkImageUrl(l.imageUrl || "");
    setLinkDescription(l.description || "");
    setLinkOrder(l.sortOrder ?? 1);
    setNotice(null);
  };

  const submitLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setBusy(true);
    try {
      const token = await getToken();
      const payload = {
        label: linkLabel,
        group: linkGroup,
        url: linkUrl,
        imageUrl: linkImageUrl,
        description: linkDescription,
        sortOrder: Number(linkOrder) || 0,
      };
      const endpoint = editingLinkId
        ? `/api/links/${editingLinkId}`
        : "/api/links";
      const method = editingLinkId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Unable to save link.");

      await refreshPortfolio();
      setNotice({
        type: "ok",
        text: editingLinkId ? "Link updated." : "Link added.",
      });
      resetLinkForm();
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to save link.",
      });
    } finally {
      setBusy(false);
    }
  };

  const deleteLink = async (id: string, label: string) => {
    setNotice(null);
    setBusy(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/links/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Unable to delete link.");
      await refreshPortfolio();
      if (editingLinkId === id) resetLinkForm();
      setNotice({ type: "ok", text: `Deleted "${label}".` });
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to delete link.",
      });
    } finally {
      setBusy(false);
    }
  };

  // --- Media handlers ---
  const resetMediaForm = () => {
    setEditingMediaId(null);
    setMediaTitle("");
    setMediaCategory("social-marketing");
    setMediaSrc("");
    setMediaAlt("");
    setMediaLinkUrl("");
    setMediaOrder(snapshot.media.length + 1);
  };

  const startEditMedia = (m: MediaItemRecord) => {
    setEditingMediaId(m.id);
    setMediaTitle(m.title);
    setMediaCategory(m.category);
    setMediaSrc(m.src);
    setMediaAlt(m.alt);
    setMediaLinkUrl(m.linkUrl || "");
    setMediaOrder(m.sortOrder ?? 1);
    setNotice(null);
  };

  const handleMediaFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "media" | "project"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNotice(null);
    try {
      const compressed = await compressImageFile(file);
      if (target === "media") {
        setMediaSrc(compressed);
        if (!mediaTitle) setMediaTitle(file.name.replace(/\.[^.]+$/, ""));
        if (!mediaAlt) setMediaAlt(file.name.replace(/\.[^.]+$/, ""));
      } else {
        setProjImageUrl(compressed);
      }
      setNotice({ type: "ok", text: "Image prepared and ready to save." });
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof Error ? err.message : "Could not process image.",
      });
    }
  };

  const submitMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setBusy(true);
    try {
      const token = await getToken();
      const payload = {
        title: mediaTitle,
        category: mediaCategory,
        src: mediaSrc,
        alt: mediaAlt || mediaTitle,
        linkUrl: mediaLinkUrl,
        sortOrder: Number(mediaOrder) || 0,
      };
      const endpoint = editingMediaId
        ? `/api/media/${editingMediaId}`
        : "/api/media";
      const method = editingMediaId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Unable to save media item.");

      await refreshPortfolio();
      setNotice({
        type: "ok",
        text: editingMediaId ? "Media updated." : "Media item added.",
      });
      resetMediaForm();
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to save media item.",
      });
    } finally {
      setBusy(false);
    }
  };

  const deleteMedia = async (id: string, title: string) => {
    setNotice(null);
    setBusy(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/media/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Unable to delete media.");
      await refreshPortfolio();
      if (editingMediaId === id) resetMediaForm();
      setNotice({ type: "ok", text: `Deleted "${title}".` });
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to delete media.",
      });
    } finally {
      setBusy(false);
    }
  };

  // --- Profile handler ---
  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setBusy(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profName,
          location: profLocation,
          headline: profHeadline,
          subheadline: profSubheadline,
          heroImage: profHeroImage,
          heroCaption: profHeroCaption,
          resumeUrl: profResumeUrl,
          assessmentUrl: profAssessmentUrl,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Unable to update profile.");
      await refreshPortfolio();
      setNotice({ type: "ok", text: "Profile configuration saved." });
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to save profile.",
      });
    } finally {
      setBusy(false);
    }
  };

  const ownerAuthenticated = isPortfolioOwner(user);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#111111]">
      <MinimalHeader mode="admin" brandName={snapshot.profile.name} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-12">
        {!authReady ? (
          <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-xl p-8 text-center text-sm text-neutral-500">
            Checking session...
          </div>
        ) : !user ? (
          <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-xl p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
                Portfolio Management Sign In
              </h1>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Sign in with your verified Google owner account (
                <span className="font-mono text-xs text-neutral-800">
                  {ADMIN_EMAIL}
                </span>
                ) to add, edit, or delete projects, links, and media.
              </p>
            </div>

            {notice && (
              <div
                role="alert"
                className="p-3 rounded-lg border border-red-200 bg-red-50 text-xs text-red-700 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{notice.text}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleSignIn}
              disabled={busy}
              className="w-full py-2.5 px-4 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-blue-600 disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span>{busy ? "Signing in..." : "Sign in with Google"}</span>
            </button>
          </div>
        ) : !ownerAuthenticated ? (
          <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-xl p-8 space-y-5">
            <h1 className="text-xl font-semibold text-neutral-950">
              Owner Access Required
            </h1>
            <p className="text-sm text-neutral-600">
              Signed in as{" "}
              <span className="font-mono text-xs text-neutral-900">
                {user.email}
              </span>
              . Management actions are restricted strictly to{" "}
              <span className="font-mono text-xs text-neutral-900">
                {ADMIN_EMAIL}
              </span>
              .
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Studio Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950">
                  Portfolio Studio
                </h1>
                <p className="text-sm text-neutral-600 mt-1">
                  Signed in as{" "}
                  <span className="font-mono text-xs text-neutral-900">
                    {user.email}
                  </span>{" "}
                  · Changes save directly to Firestore via verified API routes.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => void syncSeedToDatabase(false)}
                  disabled={busy}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-800 bg-white border border-neutral-200 rounded-lg hover:border-neutral-400 disabled:opacity-60 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sync Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {notice && (
              <div
                role={notice.type === "err" ? "alert" : "status"}
                className={`p-3.5 rounded-lg border text-sm flex items-center gap-2.5 ${
                  notice.type === "err"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}
              >
                {notice.type === "err" ? (
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                )}
                <span>{notice.text}</span>
              </div>
            )}

            {/* Segmented Tab Bar */}
            <div
              role="tablist"
              aria-label="Management sections"
              className="flex flex-wrap items-center gap-1 p-1 bg-neutral-100 border border-neutral-200 rounded-lg w-fit"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "projects"}
                onClick={() => setActiveTab("projects")}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "projects"
                    ? "bg-white text-neutral-950 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Projects ({snapshot.projects.length})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "links"}
                onClick={() => setActiveTab("links")}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "links"
                    ? "bg-white text-neutral-950 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Links ({snapshot.links.length})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "media"}
                onClick={() => setActiveTab("media")}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "media"
                    ? "bg-white text-neutral-950 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Media ({snapshot.media.length})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === "profile"
                    ? "bg-white text-neutral-950 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Profile</span>
              </button>
            </div>

            {/* TAB 1: PROJECTS */}
            {activeTab === "projects" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form
                  onSubmit={submitProject}
                  className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-neutral-950">
                      {editingProjectId ? "Edit Project" : "Add Project"}
                    </h2>
                    {editingProjectId && (
                      <button
                        type="button"
                        onClick={resetProjectForm}
                        className="text-xs text-neutral-500 hover:text-neutral-900"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={140}
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="e.g. University Database"
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-neutral-700">
                        Year
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{4}"
                        maxLength={4}
                        value={projYear}
                        onChange={(e) => setProjYear(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-neutral-700">
                        Category
                      </label>
                      <select
                        value={projCategory}
                        onChange={(e) =>
                          setProjCategory(e.target.value as ProjectCategory)
                        }
                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {PROJECT_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Project URL
                    </label>
                    <input
                      type="url"
                      required
                      value={projUrl}
                      onChange={(e) => setProjUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Concise Summary
                    </label>
                    <textarea
                      rows={2}
                      maxLength={500}
                      value={projDescription}
                      onChange={(e) => setProjDescription(e.target.value)}
                      placeholder="One-sentence outcome or purpose"
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-neutral-700">
                        Preview Image (optional)
                      </label>
                      <label className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="sr-only"
                          onChange={(e) => void handleMediaFileUpload(e, "project")}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={projImageUrl}
                      onChange={(e) => setProjImageUrl(e.target.value)}
                      placeholder="/lattly.gif or https://..."
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projFeatured}
                        onChange={(e) => setProjFeatured(e.target.checked)}
                        className="rounded border-neutral-300 text-blue-600 focus:ring-blue-600"
                      />
                      <span>Feature in visual grid</span>
                    </label>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-neutral-700">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={projOrder}
                        onChange={(e) => setProjOrder(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-sm font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {busy
                        ? "Saving..."
                        : editingProjectId
                          ? "Save Project Changes"
                          : "Add Project"}
                    </span>
                  </button>
                </form>

                <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-500">
                      All Projects
                    </span>
                    <span className="font-mono tabular-nums text-xs text-neutral-500">
                      {snapshot.projects.length} total
                    </span>
                  </div>
                  <div className="divide-y divide-neutral-200 max-h-[680px] overflow-y-auto">
                    {snapshot.projects.map((p) => (
                      <div
                        key={p.id}
                        className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-950 truncate">
                            {p.title}
                          </p>
                          <p className="text-xs text-neutral-500 font-mono tabular-nums">
                            {p.year} · {p.category}
                            {p.featured ? " · featured" : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${p.title}`}
                            className="p-2 text-neutral-500 hover:text-neutral-950 rounded-md hover:bg-neutral-100"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => startEditProject(p)}
                            aria-label={`Edit ${p.title}`}
                            className="p-2 text-neutral-600 hover:text-blue-600 rounded-md hover:bg-neutral-100"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteProject(p.id, p.title)}
                            disabled={busy}
                            aria-label={`Delete ${p.title}`}
                            className="p-2 text-neutral-500 hover:text-red-600 rounded-md hover:bg-neutral-100 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LINKS */}
            {activeTab === "links" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form
                  onSubmit={submitLink}
                  className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-neutral-950">
                      {editingLinkId ? "Edit Link" : "Add Link"}
                    </h2>
                    {editingLinkId && (
                      <button
                        type="button"
                        onClick={resetLinkForm}
                        className="text-xs text-neutral-500 hover:text-neutral-900"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Label
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={linkLabel}
                      onChange={(e) => setLinkLabel(e.target.value)}
                      placeholder="e.g. GitHub"
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-neutral-700">
                        Group
                      </label>
                      <select
                        value={linkGroup}
                        onChange={(e) => setLinkGroup(e.target.value as LinkGroup)}
                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {LINK_GROUPS.map((g) => (
                          <option key={g.value} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-neutral-700">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={linkOrder}
                        onChange={(e) => setLinkOrder(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Destination URL
                    </label>
                    <input
                      type="url"
                      required
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Thumbnail Image Path or URL (optional)
                    </label>
                    <input
                      type="text"
                      value={linkImageUrl}
                      onChange={(e) => setLinkImageUrl(e.target.value)}
                      placeholder="/linkedin-pictue.png or https://..."
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      maxLength={300}
                      value={linkDescription}
                      onChange={(e) => setLinkDescription(e.target.value)}
                      placeholder="Brief context for this link"
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {busy
                        ? "Saving..."
                        : editingLinkId
                          ? "Save Link Changes"
                          : "Add Link"}
                    </span>
                  </button>
                </form>

                <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-500">
                      Managed Links
                    </span>
                    <span className="font-mono tabular-nums text-xs text-neutral-500">
                      {snapshot.links.length} total
                    </span>
                  </div>
                  <div className="divide-y divide-neutral-200">
                    {snapshot.links.map((l) => (
                      <div
                        key={l.id}
                        className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-neutral-50"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-950 truncate">
                            {l.label}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {l.group} · {l.url}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditLink(l)}
                            aria-label={`Edit ${l.label}`}
                            className="p-2 text-neutral-600 hover:text-blue-600 rounded-md hover:bg-neutral-100"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteLink(l.id, l.label)}
                            disabled={busy}
                            aria-label={`Delete ${l.label}`}
                            className="p-2 text-neutral-500 hover:text-red-600 rounded-md hover:bg-neutral-100 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MEDIA */}
            {activeTab === "media" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form
                  onSubmit={submitMedia}
                  className="lg:col-span-5 bg-white border border-neutral-200 rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-neutral-950">
                      {editingMediaId ? "Edit Media" : "Add Media"}
                    </h2>
                    {editingMediaId && (
                      <button
                        type="button"
                        onClick={resetMediaForm}
                        className="text-xs text-neutral-500 hover:text-neutral-900"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={140}
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      placeholder="e.g. Campaign Creative"
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-neutral-700">
                        Category
                      </label>
                      <select
                        value={mediaCategory}
                        onChange={(e) =>
                          setMediaCategory(e.target.value as MediaCategory)
                        }
                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {MEDIA_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-neutral-700">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={mediaOrder}
                        onChange={(e) => setMediaOrder(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-neutral-700">
                        Image Source (Path, HTTPS URL, or Upload)
                      </label>
                      <label className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="sr-only"
                          onChange={(e) => void handleMediaFileUpload(e, "media")}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      required
                      value={mediaSrc}
                      onChange={(e) => setMediaSrc(e.target.value)}
                      placeholder="/brief-picture.jpg or https://..."
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {mediaSrc && (
                    <div className="aspect-[16/9] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                      <SmartMedia
                        src={mediaSrc}
                        alt={mediaAlt || mediaTitle || "Preview"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={200}
                      value={mediaAlt}
                      onChange={(e) => setMediaAlt(e.target.value)}
                      placeholder="Accessible image description"
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Reference URL (optional)
                    </label>
                    <input
                      type="url"
                      value={mediaLinkUrl}
                      onChange={(e) => setMediaLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {busy
                        ? "Saving..."
                        : editingMediaId
                          ? "Save Media Changes"
                          : "Add Media Item"}
                    </span>
                  </button>
                </form>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {snapshot.media.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col justify-between"
                    >
                      <div className="aspect-[16/10] bg-neutral-100 border-b border-neutral-200">
                        <SmartMedia
                          src={m.src}
                          alt={m.alt}
                          fallbackTitle={m.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-950 truncate">
                            {m.title}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {m.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditMedia(m)}
                            aria-label={`Edit ${m.title}`}
                            className="p-2 text-neutral-600 hover:text-blue-600 rounded-md hover:bg-neutral-100"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteMedia(m.id, m.title)}
                            disabled={busy}
                            aria-label={`Delete ${m.title}`}
                            className="p-2 text-neutral-500 hover:text-red-600 rounded-md hover:bg-neutral-100 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PROFILE */}
            {activeTab === "profile" && (
              <form
                onSubmit={submitProfile}
                className="max-w-2xl bg-white border border-neutral-200 rounded-xl p-6 space-y-4"
              >
                <h2 className="text-base font-semibold text-neutral-950">
                  Hero &amp; Profile Settings
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={profLocation}
                      onChange={(e) => setProfLocation(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-700">
                    Headline
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={profHeadline}
                    onChange={(e) => setProfHeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-700">
                    Subheadline
                  </label>
                  <textarea
                    rows={3}
                    required
                    maxLength={400}
                    value={profSubheadline}
                    onChange={(e) => setProfSubheadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-700">
                    Hero Image Path or URL
                  </label>
                  <input
                    type="text"
                    required
                    value={profHeroImage}
                    onChange={(e) => setProfHeroImage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-700">
                    Hero Caption
                  </label>
                  <input
                    type="text"
                    maxLength={300}
                    value={profHeroCaption}
                    onChange={(e) => setProfHeroCaption(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Resume URL
                    </label>
                    <input
                      type="url"
                      required
                      value={profResumeUrl}
                      onChange={(e) => setProfResumeUrl(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-700">
                      Personal Assessment URL
                    </label>
                    <input
                      type="url"
                      required
                      value={profAssessmentUrl}
                      onChange={(e) => setProfAssessmentUrl(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="py-2.5 px-5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {busy ? "Saving..." : "Save Profile"}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
