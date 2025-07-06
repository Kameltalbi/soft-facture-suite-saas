import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Edge function started');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Processing request...');
    
    // Créer un client Supabase avec la service role key pour les opérations admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('Supabase admin client created');

    // Créer un client normal pour vérifier les permissions de l'utilisateur appelant
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    console.log('Supabase client created');

    // Récupérer le token d'authentification depuis les headers
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.log('No authorization header');
      return new Response(
        JSON.stringify({ error: 'Pas d\'autorisation' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Authorization header found');

    // Vérifier l'utilisateur et ses permissions
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    console.log('Auth check result:', { user: user?.id, authError });

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Token invalide: ' + authError.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!user) {
      console.log('No user found');
      return new Response(
        JSON.stringify({ error: 'Utilisateur non trouvé' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier si l'utilisateur est un superadmin
    console.log('Checking permissions for user:', user.id)
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('Profile query result:', { profile, profileError })

    if (profileError) {
      console.error('Profile query error:', profileError)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la vérification des permissions: ' + profileError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!profile) {
      console.error('No profile found for user:', user.id)
      return new Response(
        JSON.stringify({ error: 'Profil utilisateur introuvable' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (profile.role !== 'superadmin') {
      console.error('User is not superadmin:', profile.role)
      return new Response(
        JSON.stringify({ error: 'Permissions insuffisantes - rôle requis: superadmin, rôle actuel: ' + profile.role }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User is superadmin, proceeding with user creation')

    // Récupérer les données de la requête
    const requestBody = await req.json()
    console.log('Request body received:', requestBody);
    
    const { email, password, firstName, lastName, organizationId, role } = requestBody

    if (!email || !password || !organizationId) {
      console.log('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Email, mot de passe et organisation sont obligatoires' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating user with admin client...');

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

    console.log('User creation result:', { user: authData?.user?.id, error: authError2 });

    if (authError2) {
      console.error('Error creating user:', authError2)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de l\'utilisateur: ' + authError2.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating user profile...');

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

    console.log('Profile creation result:', { error: profileError2 });

    if (profileError2) {
      console.error('Error creating profile:', profileError2)
      // Si la création du profil échoue, supprimer l'utilisateur créé
      console.log('Cleaning up user due to profile creation failure...');
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création du profil: ' + profileError2.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User and profile created successfully');

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
    console.error('Unexpected error in edge function:', error)
    console.error('Error stack:', error.stack)
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})