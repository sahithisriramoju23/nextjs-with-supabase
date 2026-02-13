set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$BEGIN
  INSERT INTO public.profiles (id, name, phone, phone_verified, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'display_name', 
    new.phone, 
    (new.raw_user_meta_data->>'phone_verified')::boolean, 
    new.raw_user_meta_data->>'role'
  );
  RETURN new;
END;$function$
;


