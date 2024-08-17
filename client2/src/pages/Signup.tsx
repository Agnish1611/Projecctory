"use client"

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

const signup_url = '/users';

const formSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
});

export default function SignUp() {
    return (
      <>
        <div className='h-screen w-screen flex flex-col justify-center items-center'>
          <div className='text-foreground font-semibold text-xl mb-7 font-quicksand text-zinc-200'>Sign Up</div>
          <SignUpForm />
        </div>
      </>
    );
}

function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const { toast } = useToast();

  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(signup_url,
        JSON.stringify(values),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      toast({
        variant: 'successful',
        title: "Successfully signed in",
        description: `Now login using your credentials`,
      });
      navigate('/login');

    } catch(error: any) {
        if (error?.response?.data?.err?.error === 'Username already taken') {
            toast({
                variant: 'destructive',
                title: "Failed to sign in",
                description: `Username already taken, try a different username`,
            });
        } else if (error?.response?.data?.err?.error === 'Email already in use') {
            toast({
                variant: 'destructive',
                title: "Failed to sign in",
                description: `Email already in use, try logging in or use another email`,
            });
        } else if (error?.response?.status == 400) {
            toast({
                variant: 'destructive',
                title: "Failed to sign in",
                description: `User details are invalid`,
            });
        } else {
            toast({
                variant: 'destructive',
                title: "Failed to sign in",
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="user" {...field} autoComplete='off' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          <div className='text-sm font-regular mt-5'>Already have an account? <Link to='/login'><span className='font-semibold hover:underline cursor-pointer'>Login</span></Link></div>
        </div>
      </form>
    </Form>
  );
}