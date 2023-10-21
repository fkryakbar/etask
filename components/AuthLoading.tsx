import { Spinner } from "@nextui-org/react";
import Head from "next/head";

export default function LoadingState() {
    return <>
        <Head>
            <title>Please Wait</title>
        </Head>
        <div className="flex h-screen justify-center items-center">
            <Spinner color="success" />
        </div>

    </>
}