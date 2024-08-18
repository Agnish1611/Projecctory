"use client"

import { userAtom } from '@/store/user';

import axios from '../api/axiosConfig';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

const login_url = '/users/login';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Login() {
    return (
      <>
        <div className='h-screen w-screen flex flex-col justify-center items-center'>
          <div className='text-foreground font-semibold text-xl mb-7 font-quicksand text-zinc-200'>Login</div>
          <LoginForm />
        </div>
      </>
    );
}

function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const { toast } = useToast();

  const navigate = useNavigate();

  const [ user, setUser ] = useRecoilState(userAtom);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(login_url,
        JSON.stringify(values),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const userObj = { ...user,
        username: response?.data?.username,
        email: response?.data?.email,
        uniqueId: response?.data?.uniqueId,
        friends: response?.data?.friends,
        accessToken: response?.data?.accessToken,
        profileSetup: response?.data.profileSetup
      };
      setUser(userObj);
      
      toast({
        variant: 'successful',
        title: "Successfully logged in",
        description: `Welcome to Projecctory`,
      });
      navigate('/dash');
      // if (response.data.profileSetup) {
      //   navigate('/dash');
      // } else {
      //   navigate('/setup');
      // }

    } catch(error: any) {
        if (error?.response?.status == 401 ) {
          toast({
            variant: 'destructive',
            title: "Failed to login",
            description: `${error?.response?.data?.err}`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: "Failed to login",
            description: `Internal server error`,
          });
        }
        console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[25rem] border p-10 rounded-lg font-quicksand text-zinc-200">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@email.com" {...field} autoComplete='off' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password#1234" {...field} autoComplete='off' type='password' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-col items-center'>
          <Button type="submit" variant='secondary'>Submit</Button>
          <div className='text-sm font-regular mt-5'>Don't have an account? <Link to='/signup'><span className='font-semibold hover:underline cursor-pointer'>Sign Up</span></Link></div>
        </div>
      </form>
    </Form>
  );
}
