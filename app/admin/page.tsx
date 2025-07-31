
import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Redirect to convites as default admin page
  redirect('/admin/convites')
}
