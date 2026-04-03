import { FormEvent, useEffect, useState } from "react";
import { BlogSource } from "../types";
import { createId, parseBlogType } from "../utils/blog";

type BlogFormProps = {
  editing?: BlogSource | null;
  onSubmit: (blog: BlogSource) => void;
  onCancelEdit: () => void;
};

const initialDraft: BlogSource = {
  id: "",
  name: "",
  url: "",
  type: "tistory",
  enabled: true
};

export default function BlogForm({ editing, onSubmit, onCancelEdit }: BlogFormProps) {
  const [draft, setDraft] = useState<BlogSource>(initialDraft);

  useEffect(() => {
    if (editing) {
      setDraft(editing);
    } else {
      setDraft(initialDraft);
    }
  }, [editing]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.url.trim()) {
      return;
    }

    const type = parseBlogType(draft.url);
    const id = editing ? editing.id : createId(draft.name || draft.url);
    onSubmit({
      ...draft,
      id: id || `blog-${Date.now()}`,
      type
    });
    setDraft(initialDraft);
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-warm-200 bg-warm-50 p-4">
      <input
        className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2"
        placeholder="Blog name"
        value={draft.name}
        onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
      />
      <input
        className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2"
        placeholder="Blog URL"
        value={draft.url}
        onChange={(event) => setDraft((prev) => ({ ...prev, url: event.target.value }))}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.enabled}
          onChange={(event) => setDraft((prev) => ({ ...prev, enabled: event.target.checked }))}
        />
        Enabled
      </label>
      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-warm-600 px-3 py-2 text-sm font-medium text-white">
          {editing ? "Save" : "Add"}
        </button>
        {editing ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-warm-300 bg-white px-3 py-2 text-sm"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
