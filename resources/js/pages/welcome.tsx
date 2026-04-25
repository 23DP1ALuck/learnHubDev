import { AboutUs } from '@/components/landing/AboutUs';
import { Contacts } from '@/components/landing/Contacts';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { PrimaryFeatures } from '@/components/landing/PrimaryFeatures';
import { Flash } from '@/types';
import { usePage } from '@inertiajs/react';
import moment from 'moment';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Welcome() {
    const { flash } = usePage<Flash>().props;
    useEffect(() => {
        if (flash?.success) {
            const formatted = moment().format(
                'dddd, MMMM DD, YYYY [at] h:mm A',
            );
            toast(flash.success, {
                description: formatted,
                action: {
                    label: 'Undo',
                    onClick: () => console.log('Undo'),
                },
            });
        }
    }, [flash]);
    return (
        <>
            <Header />
            <main>
                <Hero />
                <PrimaryFeatures />
                <AboutUs />
                <Contacts />
                <Footer />
            </main>
        </>
    );
}
