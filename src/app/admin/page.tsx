import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Portal Admin & Manajemen Klaster | Tiar Property',
  description:
    'Area administrasi internal pemasaran properti, direktori konsultan agen, dan inventaris unit perumahan Tiar Property.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
