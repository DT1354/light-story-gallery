import { redirect } from 'next/navigation'
import { createServerClient } from '../../lib/supabase'
import SubmitForm from '../../components/SubmitForm'

export default async function SubmitPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen py-8">
      <SubmitForm />
    </div>
  )
}