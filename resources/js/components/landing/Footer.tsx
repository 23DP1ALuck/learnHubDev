import {Container} from "@/components/landing/Container";
import Facebook from "@/components/icons/Facebook";
import Twitter from "@/components/icons/Twitter";
import Instagram from "@/components/icons/Instagram";

export const Footer = () => {
    return (
        <footer>
            <Container>
                <div className="flex justify-between items-center py-10">
                    <div className="flex">
                        <h1 className="bold text-base text-black/30">
                            © 2026 LearnHub, Inc. All rights reserved.
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Facebook className="text-black/30 hover:text-black/60 duration-300 cursor-pointer"/>
                        <Twitter className="text-black/30 hover:text-black/60 duration-300 cursor-pointer"/>
                        <Instagram className="text-black/30 hover:text-black/60 duration-300 cursor-pointer"/>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
