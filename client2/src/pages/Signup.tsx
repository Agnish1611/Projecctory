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
import { useState } from 'react';

import { FaQuoteLeft } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const signup_url = '/users';

const formSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
});

const reviews = [
  {
    desc: '"Managing my tasks and working on projects with my classmates is easier than ever."',
    user: 'Yash Khurana',
    work: 'Undergrad at IIIT Ranchi'
  },
  {
    desc: '"Adding my co-workers to a project and assigning tasks can be done with one click."',
    user: 'Aditya Verma',
    work: 'Android Developer at Microsoft'
  },
  {
    desc: '"The UI/UX is simple and easy to use."',
    user: 'Devansh Khandelwal',
    work: 'Software Engineer at Google'
  },
]

export default function Signup() {
  const [review, setReview] = useState(0);

  function handleNextReview() {
    setReview((review+1)%3);
  }

  function handlePrevReview() {
    if (review) setReview(review-1);
    else setReview(2);
  }

  return (
    <>
      <div className='absolute top-0 left-0 h-screen w-screen flex flex-col justify-around items-center bg-gradient overflow-hidden'>
        <div className='absolute top-0 left-0 h-screen w-screen bg-glass flex sm:justify-around lg:gap-10 gap-5'>
          <div className='sm:basis-1/2 max-sm:w-full sm:mx-10 max-w-[500px] my-[50px] flex flex-col justify-center'>
            <SignUpForm />
          </div>
          <div className="basis-1/2 max-w-[500px] mx-10 my-[50px] max-sm:hidden bg-[url('./assets/images/image.png')] bg-cover rounded-[50px] p-10">
            <div className='relative top-0 left-0 font-quicksand'>
              <div className='lg:text-4xl text-3xl font-bold text-white p-5 max-w-[350px]'>What our users said.</div>
              <FaQuoteLeft className='h-5 w-5 text-white' />
              <div className='text-white font-semibold text-sm p-3 mt-5'>{reviews[review].desc}</div>
              <div className='text-white text-lg font-bold'>{reviews[review].user}</div>
              <div className='text-white text-xs font-semibold'>{reviews[review].work}</div>
              <div className='flex my-5 gap-5 mt-5'>
                <Button className='bg-zinc-300' onClick={handlePrevReview}><FaArrowLeft className='text-[#904BAC]'/></Button>
                <Button className='bg-zinc-300' onClick={handleNextReview}><FaArrowRight className='text-[#904BAC]'/></Button>
              </div>
              <div className='bg-white h-[160px] rounded-[30px] w-full max-lg:hidden p-7 flex flex-col justify-between'>
                <div className='text-zinc-950 text-lg font-bold'>Manage your tasks and projects at one place.</div>
                <div className='text-zinc-700 text-xs font-semibold'>Be among the first to experience the easiest way to manage your team projects.</div>
              </div>
            </div>
          </div>
        </div>
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full p-10 rounded-lg font-quicksand text-zinc-200">
        <div className='text-2xl font-semibold py-10'>Please enter your details</div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="user" {...field} autoComplete='off' className='border-none bg-slate-200 text-zinc-950'/>
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
                <Input placeholder="user@email.com" {...field} autoComplete='off' className='border-none bg-slate-200 text-zinc-950'/>
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
                <Input placeholder="Password#1234" {...field} autoComplete='off' type='password' className='border-none bg-slate-200 text-zinc-950'/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex flex-col items-center py-10'>
          <Button type="submit" className='bg-[#904BAC] w-full h-12 font-semibold text-lg'>Submit</Button>
          <div className='text-md font-regular mt-5'>Already have an account? <Link to='/login'><span className='font-semibold hover:underline cursor-pointer'>Login</span></Link></div>
        </div>
      </form>
    </Form>
  );
}