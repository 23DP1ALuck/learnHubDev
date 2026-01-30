import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {Header} from "@/components/landing/Header";
import { Hero } from '@/components/landing/Hero';
import { PrimaryFeatures } from '@/components/landing/PrimaryFeatures';
import {AboutUs} from "@/components/landing/AboutUs";
import {Contacts} from "@/components/landing/Contacts";
import {Footer} from "@/components/landing/Footer";
import {useEffect} from "react";
import {Flash} from "@/types";
import {toast} from "sonner";
import moment from "moment";

export default function Welcome() {
    const {flash} = usePage<Flash>().props;
    useEffect(() => {
        if(flash?.success){
            const formatted = moment().format("dddd, MMMM DD, YYYY [at] h:mm A");
            toast(flash.success, {
                description: formatted,
                action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                },
            })
        }
    },[flash]);
    return (
        <>
                <Header/>
                <main>
                    <Hero/>
                    <PrimaryFeatures />
                    <AboutUs/>
                    <Contacts/>
                    <Footer/>
                </main>
        </>
    );
}
