import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Trash2, LogOut } from 'lucide-react';

{/* Profile Section */ }
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
    <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <User size={24} />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
    </div>

    <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                placeholder="Choose a username"
                minLength={3}
            />
        </div>
        <div className="flex justify-end">
            <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                <Save size={18} />
                Save Profile
            </button>
        </div>
    </form>
</div>

{/* Security Section */ }
<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
    <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <Lock size={24} />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">Security</h2>
    </div>

    <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
                <h3 className="font-medium text-slate-700">Password</h3>
                <p className="text-sm text-slate-500">Change your password via email verification.</p>
            </div>
            <button
                onClick={handleChangePasswordClick}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                    </div>
                )}
    </div>
</div>
                );
};
