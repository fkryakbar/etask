import FirstPageLayout from "@/components/Layout/FirstPageLayout";
import { sigInUser, useUser } from "@/utils/Authentication";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Login() {
    const router = useRouter()
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false)
    async function onSigIn(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;


        setIsLoading(true)
        const response = await sigInUser(data.email, data.password);
        setIsLoading(false);

    }

    const auth = useUser();
    if (auth.isLoading == false && auth.userData) {
        router.push('/task')
    }

    return (
        <FirstPageLayout title="Login">
            <div className="h-screen flex justify-center items-center dark:text-white">
                <div className="lg:w-[350px] w-full mx-5 bg-white shadow-md rounded-lg p-5 dark:bg-slate-900">
                    <Link href="/">
                        <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#00ff87] to-[#60efff]'>
                            eTask
                        </h1>
                    </Link>
                    <p className="mt-5 font-bold text-lg">Login</p>
                    <p className="mt-2  text-sm">To continue to <b>eTask</b></p>

                    <form action="" className="mt-5" method="POST" onSubmit={onSigIn}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input onChange={e => {
                                setData({ ...data, email: e.target.value })
                            }} type="email" name="email" placeholder="Type your email" className="input input-bordered w-full max-w-xs" disabled={isLoading} />
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input onChange={e => {
                                setData({ ...data, password: e.target.value })
                            }} type="password" name="password" placeholder="Choose password" className="input input-bordered w-full max-w-xs" disabled={isLoading} />
                        </div>
                        <div className="form-control w-full max-w-xs mt-3">
                            <button type="submit" className="btn bg-green-400 text-white hover:bg-green-700" disabled={isLoading}>
                                Login
                            </button>
                        </div>
                    </form>
                    <p className="my-3 text-center text-sm">Don&apos;t have any account? Click <Link className="text-green-400" href="/register">here</Link> to register</p>
                </div>
            </div>
        </FirstPageLayout>
    )
}