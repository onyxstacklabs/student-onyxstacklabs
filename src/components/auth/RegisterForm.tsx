'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserProfile, BloodGroup } from '@/types/auth';

type AccountType = 'STUDENT' | 'INSTITUTION';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterForm() {
  const [accountType, setAccountType] = useState<AccountType>('STUDENT');

  // Shared fields
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Student fields
  const [className, setClassName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [subjectsInput, setSubjectsInput] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [parentContactNumber, setParentContactNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleName, setVehicleName] = useState('');
  const [distanceFromHomeKm, setDistanceFromHomeKm] = useState('');
  const [route, setRoute] = useState('');

  // Institution fields
  const [institutionName, setInstitutionName] = useState('');
  const [institutionAddress, setInstitutionAddress] = useState('');
  const [institutionContactEmail, setInstitutionContactEmail] = useState('');
  const [institutionContactNumber, setInstitutionContactNumber] = useState('');
  const [classesInput, setClassesInput] = useState('');
  const [semestersInput, setSemestersInput] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const parseList = (value: string): string[] =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const baseProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: displayName || 'User',
        role: accountType,
        phoneNumber: phoneNumber || undefined,
        preferences: {
          theme: 'system',
          language: 'en',
          timezone: 'UTC',
          notifications: { email: true, push: true },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newProfile: UserProfile =
        accountType === 'STUDENT'
          ? {
              ...baseProfile,
              studentDetails: {
                className,
                collegeName,
                rollNumber,
                subjects: parseList(subjectsInput),
                whatsappNumber: whatsappNumber || undefined,
                parentContactNumber: parentContactNumber || undefined,
                bloodGroup: bloodGroup || undefined,
                electricVehicle: hasVehicle
                  ? {
                      hasVehicle: true,
                      vehicleName: vehicleName || undefined,
                      distanceFromHomeKm: distanceFromHomeKm
                        ? Number(distanceFromHomeKm)
                        : undefined,
                      route: route || undefined,
                    }
                  : { hasVehicle: false },
              },
            }
          : {
              ...baseProfile,
              institutionDetails: {
                institutionName,
                address: institutionAddress,
                contactEmail: institutionContactEmail,
                contactNumber: institutionContactNumber,
                classes: parseList(classesInput),
                semesters: parseList(semestersInput),
              },
            };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const inputClass =
    'w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white placeholder-slate-600';
  const labelClass = 'block text-sm font-medium mb-1 text-slate-300';

  return (
    <div className="w-full max-w-lg p-8 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl text-white">
      <h2 className="text-2xl font-bold text-center mb-1 text-indigo-400">Create your account</h2>
      <p className="text-center text-sm text-slate-400 mb-6">Join OnyxStack Labs in a few steps</p>

      <div className="mb-6 grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
        <button
          type="button"
          onClick={() => setAccountType('STUDENT')}
          className={`py-2 rounded-md text-sm font-semibold transition ${
            accountType === 'STUDENT' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          I'm a Student
        </button>
        <button
          type="button"
          onClick={() => setAccountType('INSTITUTION')}
          className={`py-2 rounded-md text-sm font-semibold transition ${
            accountType === 'INSTITUTION' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          We're an Institution
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg break-words">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Account details</p>
          <div>
            <label className={labelClass}>{accountType === 'STUDENT' ? 'Full Name' : 'Your Name (Institution Admin)'}</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className={labelClass}>Phone Number (optional)</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={inputClass}
              placeholder="+92 300 1234567"
            />
          </div>
        </div>

        {accountType === 'STUDENT' ? (
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider pt-4">Academic details</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Class / Grade</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g., 10th, 2nd Year"
                />
              </div>
              <div>
                <label className={labelClass}>Roll Number</label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className={inputClass}
                  placeholder="e.g., 24-CS-101"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>College / School Name</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className={inputClass}
                placeholder="e.g., Government College Lahore"
              />
            </div>
            <div>
              <label className={labelClass}>Subjects (comma separated)</label>
              <input
                type="text"
                value={subjectsInput}
                onChange={(e) => setSubjectsInput(e.target.value)}
                className={inputClass}
                placeholder="Physics, Chemistry, Mathematics"
              />
            </div>

            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider pt-4">Contact & safety</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className={inputClass}
                  placeholder="+92 300 1234567"
                />
              </div>
              <div>
                <label className={labelClass}>Parent's Contact Number</label>
                <input
                  type="tel"
                  value={parentContactNumber}
                  onChange={(e) => setParentContactNumber(e.target.value)}
                  className={inputClass}
                  placeholder="+92 300 7654321"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Blood Group (optional)</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup | '')}
                className={inputClass}
              >
                <option value="">Prefer not to say</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider pt-4">Commute (optional)</p>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={hasVehicle}
                onChange={(e) => setHasVehicle(e.target.checked)}
                className="w-4 h-4 accent-indigo-600"
              />
              I use a vehicle to commute
            </label>
            {hasVehicle && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Vehicle Name</label>
                  <input
                    type="text"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    className={inputClass}
                    placeholder="e.g., Honda CD 70"
                  />
                </div>
                <div>
                  <label className={labelClass}>Distance from Home (km)</label>
                  <input
                    type="number"
                    min="0"
                    value={distanceFromHomeKm}
                    onChange={(e) => setDistanceFromHomeKm(e.target.value)}
                    className={inputClass}
                    placeholder="e.g., 8"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Usual Route</label>
                  <input
                    type="text"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className={inputClass}
                    placeholder="e.g., Model Town to Campus via Ferozepur Road"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider pt-4">Institution details</p>
            <div>
              <label className={labelClass}>Institution Name</label>
              <input
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className={inputClass}
                placeholder="e.g., OnyxStack College of Sciences"
              />
            </div>
            <div>
              <label className={labelClass}>Address</label>
              <input
                type="text"
                required
                value={institutionAddress}
                onChange={(e) => setInstitutionAddress(e.target.value)}
                className={inputClass}
                placeholder="Street, City, Country"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Contact Email</label>
                <input
                  type="email"
                  required
                  value={institutionContactEmail}
                  onChange={(e) => setInstitutionContactEmail(e.target.value)}
                  className={inputClass}
                  placeholder="admissions@institution.edu"
                />
              </div>
              <div>
                <label className={labelClass}>Contact Number</label>
                <input
                  type="tel"
                  required
                  value={institutionContactNumber}
                  onChange={(e) => setInstitutionContactNumber(e.target.value)}
                  className={inputClass}
                  placeholder="+92 42 1234567"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Classes Offered (comma separated)</label>
              <input
                type="text"
                value={classesInput}
                onChange={(e) => setClassesInput(e.target.value)}
                className={inputClass}
                placeholder="9th, 10th, 1st Year, 2nd Year"
              />
            </div>
            <div>
              <label className={labelClass}>Semesters (comma separated)</label>
              <input
                type="text"
                value={semestersInput}
                onChange={(e) => setSemestersInput(e.target.value)}
                className={inputClass}
                placeholder="Fall 2026, Spring 2027"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 transition font-medium rounded-lg disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-2 text-slate-400">Or register with</span>
        </div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="w-full py-2.5 border border-slate-700 hover:bg-slate-800 transition font-medium rounded-lg flex items-center justify-center gap-2"
      >
        <span>Continue with Google</span>
      </button>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-400 hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}
