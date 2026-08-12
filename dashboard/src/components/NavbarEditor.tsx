/**
 * Navbar Editor Component
 * Manage navbar: title, logo, links, colors, sticky mode
 */

import { useState } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiUpload } from 'react-icons/fi';
import { useEnhancedFrontendControl, NavbarLink } from '@context/EnhancedFrontendControlContext';
import './NavbarEditor.css';

interface EditingLink {
  id: string;
  label: string;
  url: string;
}

export function NavbarEditor() {
  const {
    navbar,
    updateNavbar,
    addNavbarLink,
    removeNavbarLink,
    updateNavbarLink,
    reorderNavbarLinks,
  } = useEnhancedFrontendControl();

  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [draggedLinkId, setDraggedLinkId] = useState<string | null>(null);
  const [newLink, setNewLink] = useState<Omit<NavbarLink, 'id' | 'order'>>({
    label: '',
    url: '',
    active: true,
  });
  const [editingLink, setEditingLink] = useState<EditingLink | null>(null);

  // Navbar basic info handlers
  const handleUpdateTitle = (title: string) => {
    updateNavbar({ title });
  };

  const handleUpdateBackgroundColor = (color: string) => {
    updateNavbar({ backgroundColor: color });
  };

  const handleUpdateTextColor = (color: string) => {
    updateNavbar({ textColor: color });
  };

  const handleToggleSticky = () => {
    updateNavbar({ sticky: !navbar.sticky });
  };

  const handleUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateNavbar({
          logo: event.target?.result as string,
          logoFile: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Link management handlers
  const handleAddLink = () => {
    if (!newLink.label.trim() || !newLink.url.trim()) {
      alert('Link label and URL are required');
      return;
    }

    addNavbarLink(newLink);
    setNewLink({ label: '', url: '', active: true });
  };

  const handleEditLinkStart = (link: NavbarLink) => {
    setEditingLink({
      id: link.id,
      label: link.label,
      url: link.url,
    });
    setEditingLinkId(link.id);
  };

  const handleEditLinkSave = () => {
    if (!editingLink) return;
    if (!editingLink.label.trim() || !editingLink.url.trim()) {
      alert('Link label and URL are required');
      return;
    }

    updateNavbarLink(editingLink.id, {
      label: editingLink.label,
      url: editingLink.url,
    });

    setEditingLinkId(null);
    setEditingLink(null);
  };

  // Drag handlers for link reordering
  const handleDragStart = (linkId: string) => {
    setDraggedLinkId(linkId);
  };

  const handleDrop = (targetLinkId: string) => {
    if (!draggedLinkId || draggedLinkId === targetLinkId) return;

    const draggedIndex = navbar.links.findIndex((l) => l.id === draggedLinkId);
    const targetIndex = navbar.links.findIndex((l) => l.id === targetLinkId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...navbar.links];
    [newOrder[draggedIndex], newOrder[targetIndex]] = [
      newOrder[targetIndex],
      newOrder[draggedIndex],
    ];

    reorderNavbarLinks(newOrder);
    setDraggedLinkId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="navbar-editor">
      <div className="navbar-editor-header">
        <h2>Navbar Configuration</h2>
      </div>

      {/* Preview */}
      <div
        className="navbar-preview"
        style={{
          backgroundColor: navbar.backgroundColor,
          color: navbar.textColor,
        }}
      >
        <div className="navbar-preview-content">
          <div className="navbar-logo-area">
            <img
              src={navbar.logo}
              alt="Logo"
              className="navbar-preview-logo"
            />
            <span className="navbar-preview-title">{navbar.title}</span>
          </div>
          <div className="navbar-preview-links">
            {navbar.links
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <a key={link.id} href={link.url} onClick={(e) => e.preventDefault()}>
                  {link.label}
                </a>
              ))}
          </div>
        </div>
      </div>

      {/* Navbar Settings */}
      <div className="settings-section">
        <h3>Navbar Settings</h3>

        {/* Title */}
        <div className="settings-group">
          <label>Navbar Title</label>
          <input
            type="text"
            value={navbar.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            placeholder="e.g., Yatripati"
          />
        </div>

        {/* Logo Upload */}
        <div className="settings-group">
          <label>Logo</label>
          <div className="logo-upload">
            <img src={navbar.logo} alt="Current Logo" className="current-logo" />
            <label className="upload-label">
              <FiUpload /> Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadLogo}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Colors */}
        <div className="settings-group">
          <label>Background Color</label>
          <div className="color-picker">
            <input
              type="color"
              value={navbar.backgroundColor}
              onChange={(e) => handleUpdateBackgroundColor(e.target.value)}
            />
            <span>{navbar.backgroundColor}</span>
          </div>
        </div>

        <div className="settings-group">
          <label>Text Color</label>
          <div className="color-picker">
            <input
              type="color"
              value={navbar.textColor}
              onChange={(e) => handleUpdateTextColor(e.target.value)}
            />
            <span>{navbar.textColor}</span>
          </div>
        </div>

        {/* Sticky Toggle */}
        <div className="settings-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={navbar.sticky}
              onChange={handleToggleSticky}
            />
            Sticky Navbar (stays at top while scrolling)
          </label>
        </div>
      </div>

      {/* Links Management */}
      <div className="links-section">
        <h3>Navigation Links</h3>
        <p className="section-description">Add, edit, or reorder navigation links</p>

        {/* Add New Link Form */}
        <div className="add-link-form">
          <div className="form-group">
            <label>Link Label</label>
            <input
              type="text"
              placeholder="e.g., Home, News, About"
              value={newLink.label}
              onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Link URL</label>
            <input
              type="text"
              placeholder="e.g., /, /news, /about"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            />
          </div>

          <button className="btn-add-link" onClick={handleAddLink}>
            <FiPlus /> Add Link
          </button>
        </div>

        {/* Links List */}
        <div className="links-list">
          {navbar.links.length === 0 ? (
            <p className="empty-state">No navigation links. Add your first one!</p>
          ) : (
            navbar.links
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <div
                  key={link.id}
                  className={`link-card ${draggedLinkId === link.id ? 'dragging' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(link.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(link.id)}
                >
                  <div className="drag-handle">
                    ⋮⋮
                  </div>

                  {editingLinkId === link.id && editingLink ? (
                    <div className="link-edit">
                      <input
                        type="text"
                        value={editingLink.label}
                        onChange={(e) =>
                          setEditingLink({
                            ...editingLink,
                            label: e.target.value,
                          })
                        }
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={editingLink.url}
                        onChange={(e) =>
                          setEditingLink({
                            ...editingLink,
                            url: e.target.value,
                          })
                        }
                        placeholder="URL"
                      />
                    </div>
                  ) : (
                    <div className="link-info">
                      <strong>{link.label}</strong>
                      <code>{link.url}</code>
                    </div>
                  )}

                  <div className="link-actions">
                    {editingLinkId === link.id ? (
                      <>
                        <button
                          className="btn-icon btn-save"
                          onClick={handleEditLinkSave}
                          title="Save"
                        >
                          ✓
                        </button>
                        <button
                          className="btn-icon btn-cancel"
                          onClick={() => {
                            setEditingLinkId(null);
                            setEditingLink(null);
                          }}
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEditLinkStart(link)}
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => {
                            if (
                              confirm(`Delete link "${link.label}"?`)
                            ) {
                              removeNavbarLink(link.id);
                            }
                          }}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="help-box">
        <h4>Tips for Navbar:</h4>
        <ul>
          <li>Drag links to reorder them</li>
          <li>Use absolute paths (e.g., /) or relative URLs (e.g., /news)</li>
          <li>Keep navbar title short for better mobile display</li>
          <li>Choose contrasting colors for better readability</li>
        </ul>
      </div>
    </div>
  );
}
