'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authController } from '@/controllers/auth.controller';
import { User } from '@/models';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { useToast } from '@/contexts/ToastContext';
import { format } from 'date-fns';
import { 
  Clock, 
  ShieldCheck, 
  Mail, 
  Search, 
  CheckCircle2, 
  XCircle,
} from 'lucide-react';

export default function MemberApprovalsPage() {
  const { user: currentAdmin, isAdmin, approveMember, rejectMember } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const allUsers = await authController.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load member list', 'Error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleApprove = async (member: User) => {
    if (!currentAdmin) return;
    setProcessingId(member.id);

    try {
      await approveMember(member.id, {
        name: member.name,
        email: member.email,
      });

      toast.success(
        `Member ${member.name} has been approved! Confirmation email dispatched to ${member.email}.`, 
        'Approval Successful'
      );

      // Refresh list locally
      setUsers(prev => prev.map(u => u.id === member.id ? {
        ...u,
        approvalStatus: 'APPROVED',
        approvedByUserId: currentAdmin.id,
        approvedByUserName: currentAdmin.name,
        approvedAt: new Date(),
      } : u));
    } catch (err) {
      console.error('Failed to approve member:', err);
      toast.error('Failed to approve member. Please try again.', 'Error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (member: User) => {
    if (!currentAdmin) return;
    const reason = window.prompt(
      `Please enter the reason for rejecting ${member.name}'s registration:`,
      'Not a registered resident of Luhuren village'
    );

    if (reason === null) return; // Cancelled

    setProcessingId(member.id);
    try {
      await rejectMember(member.id, reason);
      toast.info(`Registration for ${member.name} has been rejected.`, 'Rejected');

      setUsers(prev => prev.map(u => u.id === member.id ? {
        ...u,
        approvalStatus: 'REJECTED',
        rejectionReason: reason,
        approvedByUserId: currentAdmin.id,
        approvedByUserName: currentAdmin.name,
        approvedAt: new Date(),
      } : u));
    } catch (err) {
      console.error('Failed to reject member:', err);
      toast.error('Failed to reject member.', 'Error');
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center space-y-3 bg-white rounded-3xl border-2 border-amber-200">
        <p className="text-3xl">🛡️</p>
        <h2 className="text-xl font-black text-stone-900">Admin Access Restricted</h2>
        <p className="text-xs text-stone-600">Only village committee administrators can access member approvals.</p>
      </div>
    );
  }

  // Filter groups
  const pendingUsers = users.filter(u => u.role !== 'ADMIN' && u.approvalStatus === 'PENDING_APPROVAL');
  const approvedUsers = users.filter(u => u.role === 'ADMIN' || u.approvalStatus === 'APPROVED');
  const rejectedUsers = users.filter(u => u.approvalStatus === 'REJECTED');

  const filteredApproved = approvedUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-100/90 via-orange-50/90 to-emerald-100/90 p-6 rounded-3xl border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl shadow-sm border border-amber-200 shrink-0">
            👥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                Sadasya Approvals &amp; Directory
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold text-[10px] uppercase">
                Admin Control
              </span>
            </div>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Verify first-time member registrations, grant Mandap access, and send automated welcome emails.
            </p>
          </div>
        </div>

        <Button 
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          className="rounded-2xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-stone-800 font-bold text-xs shrink-0"
        >
          🔄 Refresh List
        </Button>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div 
          onClick={() => setActiveTab('PENDING')}
          className={`p-4 rounded-3xl border-2 cursor-pointer transition-all ${
            activeTab === 'PENDING'
              ? 'bg-orange-50 border-orange-400 shadow-md scale-[1.02]' 
              : 'bg-white border-amber-200 hover:border-orange-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-black uppercase text-orange-900">
            <span>⏳ PENDING VERIFICATION</span>
            <span className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center text-sm">
              {pendingUsers.length}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
            {pendingUsers.length} {pendingUsers.length === 1 ? 'Applicant' : 'Applicants'}
          </p>
          <p className="text-[11px] text-stone-500 font-semibold mt-0.5">Awaiting admin review &amp; email</p>
        </div>

        <div 
          onClick={() => setActiveTab('APPROVED')}
          className={`p-4 rounded-3xl border-2 cursor-pointer transition-all ${
            activeTab === 'APPROVED' 
              ? 'bg-emerald-50 border-emerald-400 shadow-md scale-[1.02]' 
              : 'bg-white border-amber-200 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-black uppercase text-emerald-900">
            <span>🛡️ ACTIVE MEMBERS</span>
            <span className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center text-sm">
              {approvedUsers.length}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
            {approvedUsers.length} Verified
          </p>
          <p className="text-[11px] text-stone-500 font-semibold mt-0.5">Full access to village portal</p>
        </div>

        <div 
          onClick={() => setActiveTab('REJECTED')}
          className={`p-4 rounded-3xl border-2 cursor-pointer transition-all ${
            activeTab === 'REJECTED' 
              ? 'bg-rose-50 border-rose-400 shadow-md scale-[1.02]' 
              : 'bg-white border-amber-200 hover:border-rose-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-black uppercase text-rose-900">
            <span>🚫 REJECTED APPLICATIONS</span>
            <span className="w-7 h-7 rounded-xl bg-rose-100 flex items-center justify-center text-sm">
              {rejectedUsers.length}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
            {rejectedUsers.length} Declined
          </p>
          <p className="text-[11px] text-stone-500 font-semibold mt-0.5">Access withheld</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b-2 border-amber-200/80 pb-2">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'PENDING'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md font-black'
              : 'text-stone-700 hover:bg-amber-100/70'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Queue ({pendingUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'APPROVED'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md font-black'
              : 'text-stone-700 hover:bg-amber-100/70'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Active Approved ({approvedUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeTab === 'REJECTED'
              ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md font-black'
              : 'text-stone-700 hover:bg-amber-100/70'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Declined ({rejectedUsers.length})</span>
        </button>
      </div>

      {/* Content for Active Tab */}
      {loading ? (
        <div className="flex justify-center py-16 bg-white rounded-3xl border-2 border-amber-200">
          <Loader size="lg" />
        </div>
      ) : (
        <>
          {/* TAB 1: PENDING QUEUE */}
          {activeTab === 'PENDING' && (
            <div className="space-y-4">
              {pendingUsers.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-amber-300 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl mx-auto">
                    ✓
                  </div>
                  <h3 className="text-base font-black text-stone-900">All Caught Up!</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    There are no new registration requests awaiting verification. When a new person registers, their details will show here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingUsers.map(member => (
                    <div 
                      key={member.id}
                      className="bg-white p-5 rounded-3xl border-2 border-orange-200 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {member.photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={member.photoURL} 
                              alt={member.name} 
                              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-300 shrink-0" 
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-200 to-orange-300 text-amber-900 font-black text-sm flex items-center justify-center border-2 border-amber-300 shrink-0">
                              {member.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0 truncate">
                            <h3 className="text-base font-black text-stone-900 truncate">
                              {member.name}
                            </h3>
                            <p className="text-xs text-amber-800 font-semibold truncate flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              <span>{member.email}</span>
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-950 font-black text-[10px] uppercase border border-orange-300 shrink-0">
                          ⏳ Needs Verification
                        </span>
                      </div>

                      <div className="p-3 bg-amber-50/70 rounded-2xl text-[11px] font-bold text-stone-600 space-y-1 border border-amber-200">
                        <p>
                          📅 Registered on: <span className="text-stone-900">{format(member.createdAt, 'dd MMM yyyy, hh:mm a')}</span>
                        </p>
                        <p className="text-emerald-800">
                          ✉️ Automated approval email will be sent immediately upon clicking Approve.
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          disabled={processingId === member.id}
                          isLoading={processingId === member.id}
                          onClick={() => handleApprove(member)}
                          className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-sm border border-emerald-300 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve &amp; Send Mail</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={processingId === member.id}
                          onClick={() => handleReject(member)}
                          className="px-3 py-2.5 rounded-2xl border-2 border-rose-300 hover:bg-rose-50 text-rose-800 font-bold text-xs shrink-0"
                        >
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Decline</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: APPROVED MEMBERS */}
          {activeTab === 'APPROVED' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 flex items-center gap-2 shadow-xs">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search members by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none placeholder:text-stone-400"
                />
              </div>

              <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-amber-100/70 border-b-2 border-amber-200 text-amber-950 font-black uppercase text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Member Name</th>
                        <th className="py-3.5 px-4">Role</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Approved By</th>
                        <th className="py-3.5 px-4">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 font-semibold text-stone-800">
                      {filteredApproved.map(member => (
                        <tr key={member.id} className="hover:bg-amber-50/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              {member.photoURL ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={member.photoURL} alt={member.name} className="w-8 h-8 rounded-xl object-cover border border-amber-300 shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                                  {member.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-black text-stone-900">{member.name}</p>
                                <p className="text-[11px] text-stone-500 font-medium">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              member.role === 'ADMIN' 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-stone-100 text-stone-800 border border-stone-300'
                            }`}>
                              {member.role === 'ADMIN' ? '🛡️ Admin' : '👨🌾 Member'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-600 font-medium">
                            {member.approvedByUserName || (member.role === 'ADMIN' ? 'System Administrator' : 'Primary Admin')}
                          </td>
                          <td className="py-3.5 px-4 text-stone-500">
                            {format(member.createdAt, 'dd MMM yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REJECTED APPLICATIONS */}
          {activeTab === 'REJECTED' && (
            <div className="space-y-4">
              {rejectedUsers.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-amber-200">
                  <p className="text-xs text-stone-500 font-medium">No rejected applications on record.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rejectedUsers.map(member => (
                    <div 
                      key={member.id}
                      className="bg-white p-5 rounded-3xl border-2 border-rose-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-black text-stone-900">{member.name}</h3>
                          <p className="text-xs text-stone-500">{member.email}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-black uppercase">
                          Declined
                        </span>
                      </div>

                      <div className="p-3 bg-rose-50/70 rounded-2xl text-[11px] font-bold text-rose-900 border border-rose-200">
                        Reason: {member.rejectionReason || 'Declined by village administrator'}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={processingId === member.id}
                        onClick={() => handleApprove(member)}
                        className="w-full rounded-2xl border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs"
                      >
                        Re-Approve Member &amp; Send Mail
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
}
