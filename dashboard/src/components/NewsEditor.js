import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Input, TextArea, Button, Badge } from './UI';
export function NewsEditor({ article, onSave, onCancel, loading = false, onMediaSelect }) {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        image_caption: '',
        video_url: '',
        category: '',
        tags: [],
        status: 'draft',
        rank: 0,
        sticky: false,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: [],
        authors: [{ name: 'Yatripati' }],
    });
    const [tagInput, setTagInput] = useState('');
    const [keywordInput, setKeywordInput] = useState('');
    const [authorInput, setAuthorInput] = useState('');
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title || '',
                subtitle: article.subtitle || '',
                slug: article.slug || '',
                content: article.content || '',
                excerpt: article.excerpt || '',
                featured_image: article.featured_image || '',
                image_caption: article.image_caption || '',
                video_url: article.video_url || '',
                category: article.category || '',
                tags: article.tags || [],
                status: article.status || 'draft',
                rank: article.rank || 0,
                sticky: article.sticky || false,
                seoTitle: article.seoTitle || '',
                seoDescription: article.seoDescription || '',
                seoKeywords: article.seoKeywords || [],
                authors: article.authors || [{ name: 'Yatripati' }],
            });
        }
    }, [article]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value,
        }));
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim())
            newErrors.title = 'Title is required';
        if (!formData.content.trim())
            newErrors.content = 'Content is required';
        if (formData.authors.length === 0)
            newErrors.authors = 'At least one author is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSave = async () => {
        if (!validateForm())
            return;
        try {
            await onSave(formData);
        }
        catch (error) {
            console.error(error);
        }
    };
    const addAuthor = () => {
        if (!authorInput.trim())
            return;
        const newAuthor = { name: authorInput.trim() };
        setFormData(prev => ({
            ...prev,
            authors: [...prev.authors, newAuthor],
        }));
        setAuthorInput('');
    };
    const removeAuthor = (index) => {
        setFormData(prev => ({
            ...prev,
            authors: prev.authors.filter((_, i) => i !== index),
        }));
    };
    const addTag = () => {
        if (!tagInput.trim())
            return;
        const newTag = tagInput.trim().toLowerCase();
        if (!formData.tags.includes(newTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag],
            }));
        }
        setTagInput('');
    };
    const removeTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag),
        }));
    };
    const addKeyword = () => {
        if (!keywordInput.trim())
            return;
        const newKeyword = keywordInput.trim().toLowerCase();
        if (!formData.seoKeywords.includes(newKeyword)) {
            setFormData(prev => ({
                ...prev,
                seoKeywords: [...prev.seoKeywords, newKeyword],
            }));
        }
        setKeywordInput('');
    };
    const removeKeyword = (keyword) => {
        setFormData(prev => ({
            ...prev,
            seoKeywords: prev.seoKeywords.filter(k => k !== keyword),
        }));
    };
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            onMediaSelect?.(file);
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prev => ({
                    ...prev,
                    featured_image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Basic Information" }), _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Title", name: "title", value: formData.title, onChange: handleInputChange, placeholder: "Enter article title", error: errors.title, required: true }), _jsx(Input, { label: "Subtitle (optional)", name: "subtitle", value: formData.subtitle, onChange: handleInputChange, placeholder: "Enter article subtitle" }), _jsx(TextArea, { label: "Content", name: "content", value: formData.content, onChange: handleInputChange, placeholder: "Write article content here...", rows: 8, error: errors.content, required: true }), _jsx(TextArea, { label: "Excerpt (Summary)", name: "excerpt", value: formData.excerpt, onChange: handleInputChange, placeholder: "Brief summary of the article", rows: 3 })] })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Media" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Featured Image" }), formData.featured_image && (_jsxs("div", { className: "mb-4 relative group", children: [_jsx("img", { src: formData.featured_image, alt: "Featured", className: "w-full max-h-64 object-cover rounded-lg" }), _jsx("div", { className: "absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg flex items-center justify-center transition-all", children: _jsxs("label", { className: "cursor-pointer bg-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity", children: ["Change Image", _jsx("input", { type: "file", accept: "image/*", onChange: handleImageUpload, hidden: true })] }) })] })), !formData.featured_image && (_jsxs("label", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors", children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleImageUpload, hidden: true }), _jsxs("div", { className: "text-gray-500", children: [_jsx("div", { className: "text-3xl mb-2", children: "\uD83D\uDCF8" }), _jsx("div", { children: "Click to upload or drag and drop" }), _jsx("div", { className: "text-xs text-gray-400", children: "PNG, JPG, GIF up to 10MB" })] })] }))] }), _jsx(TextArea, { label: "Image Caption", name: "image_caption", value: formData.image_caption, onChange: handleInputChange, placeholder: "Caption for the featured image", rows: 2 }), _jsx(Input, { label: "Video URL (optional)", name: "video_url", value: formData.video_url, onChange: handleInputChange, placeholder: "https://youtube.com/watch?v=...", type: "url" })] })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Authors" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: authorInput, onChange: (e) => setAuthorInput(e.target.value), placeholder: "Add author name", className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", onKeyPress: (e) => e.key === 'Enter' && addAuthor() }), _jsx(Button, { onClick: addAuthor, size: "sm", children: "Add" })] }), errors.authors && _jsx("p", { className: "text-red-600 text-sm", children: errors.authors }), _jsx("div", { className: "space-y-2", children: formData.authors.map((author, idx) => (_jsxs("div", { className: "flex items-center justify-between bg-gray-50 p-3 rounded-lg", children: [_jsx("span", { className: "font-medium text-gray-900", children: author.name }), _jsx("button", { onClick: () => removeAuthor(idx), className: "text-red-600 hover:text-red-700", children: _jsx(FiX, { size: 18 }) })] }, idx))) })] })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Tags & Categories" }), _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "Category", name: "category", value: formData.category, onChange: handleInputChange, placeholder: "Enter category" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tags" }), _jsxs("div", { className: "flex gap-2 mb-2", children: [_jsx("input", { type: "text", value: tagInput, onChange: (e) => setTagInput(e.target.value), placeholder: "Add tag and press Enter or click Add", className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", onKeyPress: (e) => e.key === 'Enter' && addTag() }), _jsx(Button, { onClick: addTag, size: "sm", children: "Add" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: formData.tags.map(tag => (_jsxs(Badge, { variant: "info", children: [_jsx("span", { children: tag }), _jsx("button", { onClick: () => removeTag(tag), className: "ml-1 hover:opacity-70", children: "\u00D7" })] }, tag))) })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "SEO Settings" }), _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "SEO Title", name: "seoTitle", value: formData.seoTitle, onChange: handleInputChange, placeholder: "SEO title (55-60 characters)", maxLength: 60 }), _jsx(TextArea, { label: "SEO Description", name: "seoDescription", value: formData.seoDescription, onChange: handleInputChange, placeholder: "SEO description (150-160 characters)", rows: 2, maxLength: 160 }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Keywords" }), _jsxs("div", { className: "flex gap-2 mb-2", children: [_jsx("input", { type: "text", value: keywordInput, onChange: (e) => setKeywordInput(e.target.value), placeholder: "Add keyword", className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", onKeyPress: (e) => e.key === 'Enter' && addKeyword() }), _jsx(Button, { onClick: addKeyword, size: "sm", children: "Add" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: formData.seoKeywords.map(keyword => (_jsxs(Badge, { variant: "secondary", children: [_jsx("span", { children: keyword }), _jsx("button", { onClick: () => removeKeyword(keyword), className: "ml-1 hover:opacity-70", children: "\u00D7" })] }, keyword))) })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Publishing Options" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("select", { name: "status", value: formData.status, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "sticky", name: "sticky", checked: formData.sticky, onChange: handleInputChange, className: "w-4 h-4 rounded border-gray-300" }), _jsx("label", { htmlFor: "sticky", className: "text-sm font-medium text-gray-700", children: "Make this article sticky (featured at the top)" })] }), _jsx(Input, { label: "Post Rank (for ordering, higher = more important)", name: "rank", type: "number", value: formData.rank, onChange: handleInputChange, min: "0" })] })] }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx(Button, { variant: "ghost", onClick: onCancel, disabled: loading, children: "Cancel" }), _jsx(Button, { variant: "primary", onClick: handleSave, loading: loading, children: article ? 'Update Article' : 'Create Article' })] })] }));
}
