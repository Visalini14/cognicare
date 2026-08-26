import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFamilyMembers, saveFamilyMember, deleteFamilyMember, uploadFamilyPhoto, seedDemoData, compressImage } from '../../services/storage';
import { extractFaceEmbeddingFromSource, ensureFamilyEmbeddings } from '../../services/faceRecognition';
import { Card, Button, Modal, Input, Select, EmptyState } from '../../components/common/UIComponents';
import { Users, Plus, Edit2, Trash2, Image as ImageIcon, Heart, UserCheck, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import type { FamilyMember } from '../../types';

export const FamilyMembersManager: React.FC = () => {
  const { user } = useAuth();
  const caregiverId = user?.uid || 'caregiver-1';
  const targetPatientId = user?.patientId || 'patient-1';
  const targetPatientName = user?.patientName || 'Aarav Sharma';

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Daughter');
  const [notes, setNotes] = useState('');

  // 2-5 Reference photos support
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photoEmbeddings, setPhotoEmbeddings] = useState<number[][]>([]);

  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [validationSuccess, setValidationSuccess] = useState('');

  const loadMembers = async () => {
    setLoading(true);
    const data = await getFamilyMembers(targetPatientId);
    const processed = await ensureFamilyEmbeddings(data);
    setMembers(processed);
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, [targetPatientId]);

  const handleRefreshEmbeddings = async () => {
    setLoading(true);
    localStorage.removeItem('cognicare_demo_family');
    seedDemoData();
    const data = await getFamilyMembers(targetPatientId);
    const processed = await ensureFamilyEmbeddings(data);
    setMembers(processed);
    setLoading(false);
    alert('AI Family Recognition neural descriptors refreshed successfully!');
  };

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setRelationship('Daughter');
    setNotes('');
    setPhotoPreviews([]);
    setPhotoEmbeddings([]);
    setError('');
    setValidationSuccess('');
    setValidating(false);
    setSaving(false);
    setIsModalOpen(true);
  };

  const openEditModal = (member: FamilyMember) => {
    setEditingMember(member);
    setName(member.name);
    setRelationship(member.relationship);
    setNotes(member.notes || '');
    setPhotoPreviews(member.photos && member.photos.length > 0 ? member.photos : [member.photoUrl]);
    setPhotoEmbeddings(member.embeddings || []);
    setError('');
    setValidationSuccess('');
    setValidating(false);
    setSaving(false);
    setIsModalOpen(true);
  };

  const handleImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size should be less than 5MB.');
      return;
    }

    if (photoPreviews.length >= 5) {
      setError('Maximum 5 reference photos allowed per family member.');
      return;
    }

    setError('');
    setValidationSuccess('');
    setValidating(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const rawDataUrl = reader.result as string;
        const dataUrl = await compressImage(rawDataUrl, 600, 0.75);
        const img = new Image();
        img.onload = async () => {
          try {
            // Validate image face detection & extract neural network facial descriptor
            const result = await extractFaceEmbeddingFromSource(img);

            if (!result.hasFace) {
              setError("Couldn't find a clear face in this photo. Please upload a clear front-facing photo.");
              setValidating(false);
              return;
            }

            setPhotoPreviews((prev) => [...prev, dataUrl]);
            if (result.embedding) {
              setPhotoEmbeddings((prev) => [...prev, result.embedding!]);
            }
            setValidationSuccess(`Face detected successfully! Added photo ${photoPreviews.length + 1} of 5.`);
          } catch (err: any) {
            setError('Error analyzing face photo. Please try another clear image.');
          } finally {
            setValidating(false);
          }
        };
        img.onerror = () => {
          setError('Failed to load photo file.');
          setValidating(false);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setError('Failed to read image file.');
      setValidating(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    setPhotoEmbeddings((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter the family member's name.");
      return;
    }
    if (photoPreviews.length === 0) {
      setError('Please upload at least 1 clear photo of the family member.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Upload primary photo
      const primaryPhotoUrl = await uploadFamilyPhoto(photoPreviews[0]);

      // Upload remaining photos
      const uploadedPhotos: string[] = [primaryPhotoUrl];
      for (let i = 1; i < photoPreviews.length; i++) {
        const url = await uploadFamilyPhoto(photoPreviews[i]);
        uploadedPhotos.push(url);
      }

      await saveFamilyMember({
        id: editingMember?.id,
        caregiverId,
        patientId: targetPatientId,
        name,
        relationship,
        photoUrl: primaryPhotoUrl,
        photos: uploadedPhotos,
        embeddings: photoEmbeddings,
        notes,
      });

      setIsModalOpen(false);
      await loadMembers();
    } catch (err: any) {
      setError(err.message || 'Failed to save family member photo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this family member photo card?')) {
      await deleteFamilyMember(id);
      await loadMembers();
    }
  };

  const relationshipOptions = [
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Son', label: 'Son' },
    { value: 'Spouse/Wife/Husband', label: 'Spouse / Wife / Husband' },
    { value: 'Granddaughter', label: 'Granddaughter' },
    { value: 'Grandson', label: 'Grandson' },
    { value: 'Brother/Sister', label: 'Brother / Sister' },
    { value: 'Friend/Caregiver', label: 'Friend / Caregiver' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-4 h-4" /> Family Recognition Cards
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Family Members ({targetPatientName})</h1>
          <div className="flex items-center gap-2 mt-1">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <p className="text-slate-500 font-medium text-sm">
              Managing photo recall & AI camera recognition data for: <span className="font-extrabold text-slate-800">{targetPatientName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={RefreshCw} onClick={handleRefreshEmbeddings}>
            Refresh AI Descriptors
          </Button>
          <Button variant="primary" size="lg" icon={Plus} onClick={openAddModal}>
            Add Family Member
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 font-semibold">Loading family member cards & neural embeddings...</div>
      ) : members.length === 0 ? (
        <EmptyState
          title={`No Family Members for ${targetPatientName}`}
          description={`Click 'Add Family Member' above to upload photos (2-5 clear reference photos recommended for AI camera recognition).`}
          icon={Users}
          action={
            <Button variant="primary" size="md" icon={Plus} onClick={openAddModal}>
              Add First Family Member
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="p-6 border-2 border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-full h-56 rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-200 shadow-sm relative group">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-800 shadow-sm flex items-center gap-1">
                    {member.relationship}
                  </div>
                  {member.photos && member.photos.length > 1 && (
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[11px] px-2.5 py-1 rounded-full font-bold">
                      {member.photos.length} photos registered
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900">{member.name}</h3>
                <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mt-0.5">
                  Relationship: {member.relationship}
                </p>

                {member.notes && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{member.notes}"
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" icon={Edit2} onClick={() => openEditModal(member)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(member.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* REGISTRATION / EDIT MODAL WITH MULTI-PHOTO UPLOAD & FACE VALIDATION */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? `Edit Family Member (${targetPatientName})` : `Add Family Member for ${targetPatientName}`}
      >
        <form onSubmit={handleSave} className="space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {validationSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{validationSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Reference Photos (2–5 recommended)
            </label>
            <p className="text-xs text-slate-500 mb-3">
              For better AI camera recognition, upload 2–5 clear, front-facing photos of the person from slightly different angles.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-2">
              {photoPreviews.map((src, idx) => (
                <div key={idx} className="relative h-24 rounded-2xl overflow-hidden border-2 border-slate-300 group shadow-xs">
                  <img src={src} alt={`Ref ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 cursor-pointer"
                    title="Remove photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-slate-900/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                    #{idx + 1}
                  </span>
                </div>
              ))}

              {photoPreviews.length < 5 && (
                <label className="h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-teal-500 flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center">
                  <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[11px] font-bold text-slate-700">
                    {validating ? 'Scanning...' : '+ Add Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageAdd}
                    disabled={validating}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <Input
            label="Full Name"
            placeholder="e.g. Salu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Select
            label="Relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            options={relationshipOptions}
          />

          <div className="w-full mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Memory Notes / Cues (Optional)</label>
            <textarea
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-2xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={2}
              placeholder="e.g. Granddaughter studying architecture."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* ALWAYS VISIBLE & SCROLLABLE SAVE BUTTON FOOTER */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 sticky bottom-0 bg-white z-10">
            <Button type="button" variant="outline" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={saving || validating}>
              {saving ? 'Saving Family Member...' : editingMember ? 'Update Family Member' : 'Save Family Member'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
