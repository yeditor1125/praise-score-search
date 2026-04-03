import { useState } from "react";
import { BlogSource } from "../types";
import BlogForm from "./BlogForm";
import BlogList from "./BlogList";

type AdminModalProps = {
  isOpen: boolean;
  blogs: BlogSource[];
  onClose: () => void;
  onChange: (blogs: BlogSource[]) => void;
};

export default function AdminModal({ isOpen, blogs, onClose, onChange }: AdminModalProps) {
  const [editing, setEditing] = useState<BlogSource | null>(null);
  if (!isOpen) {
    return null;
  }

  const saveBlog = (nextBlog: BlogSource) => {
    const exists = blogs.some((blog) => blog.id === nextBlog.id);
    const next = exists ? blogs.map((blog) => (blog.id === nextBlog.id ? nextBlog : blog)) : [...blogs, nextBlog];
    onChange(next);
    setEditing(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-800">Admin Panel</h2>
          <button onClick={onClose} className="rounded-lg border border-warm-300 px-3 py-1 text-sm">
            Close
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <BlogForm editing={editing} onSubmit={saveBlog} onCancelEdit={() => setEditing(null)} />
          <BlogList
            blogs={blogs}
            onEdit={setEditing}
            onDelete={(id) => onChange(blogs.filter((blog) => blog.id !== id))}
            onToggle={(id) =>
              onChange(blogs.map((blog) => (blog.id === id ? { ...blog, enabled: !blog.enabled } : blog)))
            }
          />
        </div>
      </div>
    </div>
  );
}
