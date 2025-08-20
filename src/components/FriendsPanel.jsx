import React, { useEffect, useMemo, useState } from "react";
import { API_URL } from "../shared";
import "./FriendsPanel.css";

const Tab = { FRIENDS: "friends", INCOMING: "incoming", OUTGOING: "outgoing", FIND: "find" };

export default function FriendsPanel({ open, onClose, user }) {
  /* --- Who am I? (prop -> localStorage -> /api/users/me) --- */
  const [meId, setMeId] = useState(0);
  useEffect(() => {
    if (!open) return;
    (async () => {
      let id =
        Number(user?.id) ||
        Number(localStorage.getItem("userId")) ||
        0;

      if (!id) {
        try {
          const r = await fetch(`${API_URL}/api/users/me`, { credentials: "include" });
          if (r.ok) {
            const me = await r.json();
            id = Number(me?.id) || 0;
          }
        } catch (_) {}
      }
      setMeId(Number.isFinite(id) ? id : 0);
    })();
  }, [open, user]);

  const [tab, setTab] = useState(Tab.FRIENDS);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [rows, setRows] = useState([]);   // /api/friends (normalized)
  const [users, setUsers] = useState([]); // /api/users

  const id2user = useMemo(
    () => Object.fromEntries((users || []).map(u => [Number(u.id), u])),
    [users]
  );

  const [query, setQuery] = useState("");
  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return (users || [])
      .filter(u => Number(u.id) !== meId)
      .filter(u =>
        (u.display_name || "").toLowerCase().includes(q) ||
        (u.username || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
      );
  }, [users, query, meId]);

  /* --- Normalize helpers --- */
  const normalizeRows = (arr) =>
    Array.isArray(arr)
      ? arr.map(r => ({
          ...r,
          id: Number(r.id),
          user_id: Number(r.user_id),
          friend_id: Number(r.friend_id),
        }))
      : [];

  /* --- Load data --- */
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setErr(""); setLoading(true);
        const [fr, us] = await Promise.all([
          fetch(`${API_URL}/api/friends`, { credentials: "include" }),
          fetch(`${API_URL}/api/users`,   { credentials: "include" }),
        ]);
        if (!fr.ok || !us.ok) throw new Error("Load failed");
        setRows(normalizeRows(await fr.json()));
        setUsers(await us.json());
      } catch (e) {
        console.error(e);
        setErr("Could not load friends.");
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  /* --- Derived buckets (numeric comparisons) --- */
  const friends = useMemo(
    () => rows.filter(r => r.status === "accepted").map(r => (r.user_id === meId ? r.friend_id : r.user_id)),
    [rows, meId]
  );
  const incoming = useMemo(
    () => rows.filter(r => r.status === "pending" && r.friend_id === meId),
    [rows, meId]
  );
  const outgoing = useMemo(
    () => rows.filter(r => r.status === "pending" && r.user_id === meId),
    [rows, meId]
  );

  /* --- Actions --- */
  async function doAction(url, method, body, refreshAfter = true) {
    try {
      setErr(""); setLoading(true);
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error(`${method} ${url}: ${res.status}`);

      if (refreshAfter) {
        const fr = await fetch(`${API_URL}/api/friends`, { credentials: "include" });
        if (fr.ok) setRows(normalizeRows(await fr.json()));
      }
    } catch (e) {
      console.error(e);
      setErr("Action failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const sendRequest   = (targetId) => doAction(`${API_URL}/api/friends`, "POST",   { friend_id: targetId }, true);
  const accept        = (rowId)    => doAction(`${API_URL}/api/friends/${rowId}/accept`, "PATCH");
  const block         = (rowId)    => doAction(`${API_URL}/api/friends/${rowId}/block`,  "PATCH");
  const removeOrCancel= (rowId)    => doAction(`${API_URL}/api/friends/${rowId}`,        "DELETE");

  /* --- Escape closes --- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="nearby-overlay" onClick={onClose} aria-hidden="true" />
      <aside className="friends-panel" role="dialog" aria-modal="true" aria-label="Friends">
        <header className="friends-header">
          <strong>Friends</strong>
          <div className="friends-tabs">
            <button className={tab === Tab.FRIENDS  ? "active" : ""} onClick={() => setTab(Tab.FRIENDS)}>Friends</button>
            <button className={tab === Tab.INCOMING ? "active" : ""} onClick={() => setTab(Tab.INCOMING)}>Requests</button>
            <button className={tab === Tab.OUTGOING ? "active" : ""} onClick={() => setTab(Tab.OUTGOING)}>Sent</button>
            <button className={tab === Tab.FIND     ? "active" : ""} onClick={() => setTab(Tab.FIND)}>Find</button>
          </div>
          <button className="friends-close" onClick={onClose} aria-label="Close">✕</button>
        </header>

        {err && <div className="friends-error">{err}</div>}
        {loading && <div className="friends-loading">Loading…</div>}
        {!meId && !loading && <div className="friends-error">Not signed in.</div>}

        <div className="friends-body">
          {tab === Tab.FRIENDS && (
            <List
              empty="No friends yet."
              items={friends}
              render={(uid) => {
                const u = id2user[Number(uid)] || {};
                return (
                  <Row
                    title={u.display_name || u.username || `User ${uid}`}
                    subtitle={u.email}
                    right={
                      <button
                        className="danger"
                        onClick={() => {
                          const row = rows.find(
                            r => r.status === "accepted" &&
                            [r.user_id, r.friend_id].includes(Number(uid))
                          );
                          if (row) removeOrCancel(row.id);
                        }}
                      >
                        Remove
                      </button>
                    }
                  />
                );
              }}
            />
          )}

          {tab === Tab.INCOMING && (
            <List
              empty="No incoming requests."
              items={incoming}
              render={(r) => {
                const u = id2user[r.user_id] || {};
                return (
                  <Row
                    title={u.display_name || u.username || `User ${r.user_id}`}
                    subtitle="sent you a request"
                    right={
                      <div className="row-actions">
                        <button onClick={() => accept(r.id)}>Accept</button>
                        <button className="secondary" onClick={() => removeOrCancel(r.id)}>Decline</button>
                        <button className="secondary" onClick={() => block(r.id)} title="Block further requests">Block</button>
                      </div>
                    }
                  />
                );
              }}
            />
          )}

          {tab === Tab.OUTGOING && (
            <List
              empty="No sent requests."
              items={outgoing}
              render={(r) => {
                const u = id2user[r.friend_id] || {};
                return (
                  <Row
                    title={u.display_name || u.username || `User ${r.friend_id}`}
                    subtitle="pending"
                    right={<button className="secondary" onClick={() => removeOrCancel(r.id)}>Cancel</button>}
                  />
                );
              }}
            />
          )}

          {tab === Tab.FIND && (
            <div className="friends-find">
              <form onSubmit={(e) => e.preventDefault()} className="friends-search">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or @username"
                />
              </form>

              <List
                empty={query ? "No users found." : "Search for someone to add."}
                items={filteredUsers}
                render={(u) => (
                  <Row
                    key={u.id}
                    title={u.display_name || u.username || `User ${u.id}`}
                    subtitle={u.email}
                    right={<button onClick={() => sendRequest(u.id)}>Add</button>}
                  />
                )}
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/* helpers */
function List({ items, render, empty }) {
  if (!items?.length) return <p className="friends-empty">{empty}</p>;
  return (
    <div className="friends-list">
      {items.map((x, i) => (
        <div key={x?.id ?? i} className="friends-card">
          {render(x)}
        </div>
      ))}
    </div>
  );
}

function Row({ title, subtitle, right }) {
  return (
    <div className="friends-row">
      <div className="friends-row-main">
        <div className="friends-title">{title}</div>
        {subtitle && <div className="friends-sub">{subtitle}</div>}
      </div>
      <div className="friends-row-right">{right}</div>
    </div>
  );
}
