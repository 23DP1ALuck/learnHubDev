import Facebook from '@/components/icons/Facebook';
import Instagram from '@/components/icons/Instagram';
import Twitter from '@/components/icons/Twitter';
import { Container } from '@/components/landing/Container';
import { useTranslation } from '@/hooks/use-translation';
export const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer>
            <Container>
                <div className="flex items-center justify-between py-10">
                    <div className="flex">
                        <h1 className="bold text-base text-black/30">
                            {t(
                                'landing.© 2026 LearnHub, Inc. All rights reserved.',
                            )}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Facebook className="cursor-pointer text-black/30 duration-300 hover:text-black/60" />
                        <Twitter className="cursor-pointer text-black/30 duration-300 hover:text-black/60" />
                        <Instagram className="cursor-pointer text-black/30 duration-300 hover:text-black/60" />
                    </div>
                </div>
            </Container>
        </footer>
    );
};
