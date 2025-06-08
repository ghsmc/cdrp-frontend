import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-600 text-white border-red-500 shadow-md';
    case 'high':
      return 'bg-orange-600 text-white border-orange-500 shadow-md';
    case 'medium':
      return 'bg-yellow-600 text-white border-yellow-500 shadow-md';
    case 'low':
      return 'bg-green-600 text-white border-green-500 shadow-md';
    default:
      return 'bg-gray-600 text-white border-gray-500 shadow-md';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-600 text-white border-green-500 shadow-md';
    case 'in_progress':
      return 'bg-blue-600 text-white border-blue-500 shadow-md';
    case 'approved':
      return 'bg-indigo-600 text-white border-indigo-500 shadow-md';
    case 'pending':
      return 'bg-yellow-600 text-white border-yellow-500 shadow-md';
    case 'cancelled':
      return 'bg-gray-600 text-white border-gray-500 shadow-md';
    default:
      return 'bg-gray-600 text-white border-gray-500 shadow-md';
  }
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}