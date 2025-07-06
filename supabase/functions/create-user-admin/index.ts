import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Créer un client Supabase avec la service role key pour les opérations admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Créer un client normal pour vérifier les permissions de l'utilisateur appelant
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Récupérer le token d'authentification depuis les headers
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Pas d\'autorisation' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier l'utilisateur et ses permissions
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token invalide' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier si l'utilisateur est un superadmin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'superadmin') {
      return new Response(
        JSON.stringify({ error: 'Permissions insuffisantes' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Récupérer les données de la requête
    const { email, password, firstName, lastName, organizationId, role } = await req.json()

    if (!email || !password || !organizationId) {
      return new Response(
        JSON.stringify({ error: 'Email, mot de passe et organisation sont obligatoires' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Créer l'utilisateur avec l'admin client
    const { data: authData, error: authError2 } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        organization_id: organizationId,
        role: role || 'user'
      }
    })

    if (authError2) {
      console.error('Error creating user:', authError2)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de l\'utilisateur: ' + authError2.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Créer le profil utilisateur
    const { error: profileError2 } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        email: email,
        first_name: firstName || null,
        last_name: lastName || null,
        organization_id: organizationId,
        role: role || 'user'
      })

    if (profileError2) {
      console.error('Error creating profile:', profileError2)
      // Si la création du profil échoue, supprimer l'utilisateur créé
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création du profil: ' + profileError2.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: authData.user.id,
          email: authData.user.email
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})