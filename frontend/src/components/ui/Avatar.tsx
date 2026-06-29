import type { User } from '../../types';

interface AvatarProps {
  user?: Partial<User>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

const gradients = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-indigo-500 to-blue-500',
];

function getGradient(name: string) {
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx];
}

export default function Avatar({ user, size = 'md', showStatus = false }: AvatarProps) {
  const name = user?.displayName || user?.username || '?';
  const initials = name.slice(0, 2).toUpperCase();
  const gradient = getGradient(name);

  const statusClass = {
    ONLINE: 'status-online',
    AWAY: 'status-away',
    BUSY: 'status-busy',
    OFFLINE: 'status-offline',
  }[user?.status || 'OFFLINE'];

  return (
    <div className="relative flex-shrink-0">
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-semibold text-white`}
        >
          {initials}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} rounded-full border-2 border-dark-400 ${statusClass}`}
        />
      )}
    </div>
  );
}
