import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../lib/api';
import { PlusIcon, PencilIcon, Trash2Icon, XIcon, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll
  });

  const createMutation = useMutation({
    mutationFn: (formData) => categoryApi.create(formData),
    onSuccess: () => {
      toast.success("Category added!");
      queryClient.invalidateQueries(['categories']);
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => categoryApi.update({ id, formData }),
    onSuccess: () => {
      toast.success("Category updated!");
      queryClient.invalidateQueries(['categories']);
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.delete(id),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries(['categories']);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) formData.append("image", imageFile);

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setName("");
    setImageFile(null);
    setPreview("");
  };

  return (
    <div className="p-6 text-white min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your category structure</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn h-11 px-6 bg-[#22c55e] hover:bg-[#16a34a] border-none text-black font-semibold rounded-lg flex items-center gap-2 transition-all"
        >
          <PlusIcon size={20} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-1">
        {isLoading ? (
          <div className="flex justify-center p-12"><span className="loading loading-spinner text-success"></span></div>
        ) : (
          categories?.data?.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between py-5 border-b border-white/5 group hover:bg-white/[0.02] px-4 rounded-xl transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 shadow-xl bg-neutral-900">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-200">{cat.name}</h3>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setEditingCategory(cat);
                    setName(cat.name);
                    setPreview(cat.image);
                    setIsModalOpen(true);
                  }}
                  className="p-2.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                  title="Edit Category"
                >
                  <PencilIcon size={20} />
                </button>
                <button 
                  onClick={() => { if(window.confirm(`Delete "${cat.name}"?`)) deleteMutation.mutate(cat._id) }}
                  className="p-2.5 rounded-full hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all"
                  title="Delete Category"
                >
                  <Trash2Icon size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{editingCategory ? 'Edit' : 'New'} Category</h2>
              <button onClick={closeModal} className="p-1 hover:bg-white/10 rounded-full transition-colors"><XIcon /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Category Name</label>
                <input 
                  className="w-full h-12 bg-transparent border-b-2 border-white/10 focus:border-[#22c55e] outline-none text-lg transition-all"
                  placeholder="e.g. Lipsticks"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 ml-1">Category Image</label>
                <div 
                  className="h-48 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#22c55e]/50 hover:bg-white/[0.02] transition-all relative overflow-hidden"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-3 text-gray-600" size={44}/>
                      <p className="text-sm text-gray-500 font-medium">Click to upload file</p>
                    </div>
                  )}
                  <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 h-12 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
                <button type="submit" className="flex-1 h-12 rounded-xl font-bold bg-[#22c55e] text-black hover:bg-[#16a34a] transition-all disabled:opacity-50" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? "Processing..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;