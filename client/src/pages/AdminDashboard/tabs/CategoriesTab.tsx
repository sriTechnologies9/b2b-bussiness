import React, { useState, useEffect } from 'react';
import { Loader2, Trash2, Edit3, Plus, Tags, X } from 'lucide-react';
import { apiClient } from '../../../api/client';

interface CategoriesTabProps {
  addLog: (message: string) => void;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({ addLog }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('');
  const [submittingCat, setSubmittingCat] = useState(false);
  const [catError, setCatError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/businesses/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const editCategory = async (catId: string, oldName: string) => {
    const newName = window.prompt('Enter new name for category:', oldName);
    if (!newName || newName === oldName) return;
    const newIcon = window.prompt('Enter Lucide icon name (e.g., Zap, Wrench, Activity, Heart):');
    
    try {
      await apiClient.put(`/businesses/categories/${catId}`, {
        name: newName,
        icon: newIcon || undefined
      });
      addLog(`[Audit] Updated category "${oldName}" to "${newName}".`);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update category');
    }
  };

  const deleteCategory = async (catId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await apiClient.delete(`/businesses/categories/${catId}`);
      addLog(`[Audit] Deleted category "${name}".`);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete category');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError('');
    setSubmittingCat(true);

    try {
      await apiClient.post('/businesses/categories', {
        name: newCatName,
        icon: newCatIcon || 'HelpCircle'
      });
      addLog(`[Audit] Category "${newCatName}" created successfully.`);
      setIsCategoryModalOpen(false);
      setNewCatName('');
      setNewCatIcon('');
      fetchCategories();
    } catch (err: any) {
      setCatError(err.message);
      addLog(`[Error] Failed to create category: ${err.message}`);
    } finally {
      setSubmittingCat(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Directory Taxonomy</h1>
          <p className="text-xs text-slate-500 mt-1">Manage active business categories, change display icons, or delete unused tags.</p>
        </div>
        <button
          onClick={() => {
            setCatError('');
            setIsCategoryModalOpen(true);
          }}
          className="inline-flex items-center space-x-1 px-4 py-2 rounded-none text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/10 transition-all"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Create Category</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-200">
          {categories.map((cat) => (
            <div key={cat.id} className="p-5 rounded-none glass-panel border border-slate-200 bg-white shadow-glass-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-none bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                  <Tags className="w-5 h-5" />
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => editCategory(cat.id, cat.name)}
                    className="p-1 rounded-none hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    title="Edit Category Name/Icon"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id, cat.name)}
                    className="p-1 rounded-none hover:bg-red-50 text-slate-500 hover:text-red-655"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-sm">{cat.name}</h3>
                <p className="text-[10px] text-slate-400 font-mono">slug: {cat.slug}</p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-2xs font-extrabold uppercase tracking-wide text-slate-455">
                <span>Listings Connected</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-none text-slate-600">
                  {cat._count?.businesses || 0} active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900">Add New Category</h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCategory} className="p-5 space-y-4">
              {catError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                  {catError}
                </div>
              )}
              
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Electrical Services"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">Lucide Icon Name</label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  placeholder="e.g. Zap, Wrench (Optional)"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCat || !newCatName}
                  className="inline-flex items-center px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 disabled:opacity-50"
                >
                  {submittingCat && <Loader2 className="w-3 h-3 animate-spin mr-2" />}
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
