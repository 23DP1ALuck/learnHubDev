import Building from '@/components/icons/Building';
import Envelope from '@/components/icons/Envelope';
import Phone from '@/components/icons/Phone';
import { Container } from '@/components/ui/container';
import { useTranslation } from '@/hooks/use-translation';
export const Contacts = () => {
    const { t } = useTranslation();
    return (
        <Container>
            <div className="relative isolate bg-white" id="contacts">
                <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                    <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48">
                        <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                            <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2">
                                <svg
                                    aria-hidden="true"
                                    className="absolute inset-0 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200"
                                >
                                    <defs>
                                        <pattern
                                            x="100%"
                                            y={-1}
                                            id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                                            width={200}
                                            height={200}
                                            patternUnits="userSpaceOnUse"
                                        >
                                            <path
                                                d="M130 200V.5M.5 .5H200"
                                                fill="none"
                                            />
                                        </pattern>
                                    </defs>
                                    <rect
                                        width="100%"
                                        height="100%"
                                        strokeWidth={0}
                                        className="fill-white"
                                    />
                                    <svg
                                        x="100%"
                                        y={-1}
                                        className="overflow-visible fill-gray-50"
                                    >
                                        <path
                                            d="M-470.5 0h201v201h-201Z"
                                            strokeWidth={0}
                                        />
                                    </svg>
                                    <rect
                                        fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                                        width="100%"
                                        height="100%"
                                        strokeWidth={0}
                                    />
                                </svg>
                                <div
                                    aria-hidden="true"
                                    className="absolute top-[calc(100%-13rem)] -left-56 hidden transform-gpu blur-3xl lg:top-[calc(50%-7rem)] lg:left-[max(-14rem,calc(100%-59rem))]"
                                >
                                    <div
                                        style={{
                                            clipPath:
                                                'polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)',
                                        }}
                                        className="aspect-1155/678 w-288.75 bg-linear-to-br from-[#80caff] to-[#4f46e5] opacity-10"
                                    />
                                </div>
                            </div>
                            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                                {t('landing.Sazinies ar mums')}
                            </h2>
                            <p className="mt-6 text-lg/8 text-gray-600">
                                {t(
                                    'landing.Ja tev ir jautājumi par LearnHub vai vēlies uzzināt vairāk par iespējām skolām un kursiem — uzraksti mums. Atbildēsim pēc iespējas ātrāk.',
                                )}
                            </p>
                            <dl className="mt-10 space-y-4 text-base/7 text-gray-600">
                                <div className="flex gap-x-4">
                                    <dt className="flex-none">
                                        <span className="sr-only">Address</span>
                                        <Building
                                            aria-hidden="true"
                                            className="h-7 w-6 text-gray-400"
                                        />
                                    </dt>
                                    <dd>
                                        {t('landing.Zeiferta iela 20')} <br />{' '}
                                        {t('landing.Olaine, LV-2114')}
                                    </dd>
                                </div>
                                <div className="flex gap-x-4">
                                    <dt className="flex-none">
                                        <span className="sr-only">
                                            Telephone
                                        </span>
                                        <Phone
                                            aria-hidden="true"
                                            className="h-7 w-6 text-gray-400"
                                        />
                                    </dt>
                                    <dd>
                                        <a
                                            href="tel:+37122233344"
                                            className="hover:text-gray-900"
                                        >
                                            +371 22233344
                                        </a>
                                    </dd>
                                </div>
                                <div className="flex items-center gap-x-4">
                                    <dt className="flex-none">
                                        <span className="sr-only">
                                            {t('common.Email')}
                                        </span>
                                        <Envelope
                                            aria-hidden="true"
                                            className="h-7 w-6 text-gray-400"
                                        />
                                    </dt>
                                    <dd>
                                        <a
                                            href="mailto:help@learnhub.com"
                                            className="hover:text-gray-900"
                                        >
                                            help@learnhub.com
                                        </a>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                    <form
                        action="#"
                        method="POST"
                        className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48"
                    >
                        <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="first-name"
                                        className="block text-sm/6 font-semibold text-gray-900"
                                    >
                                        {t('landing.Vārds')}
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            id="first-name"
                                            name="first-name"
                                            type="text"
                                            autoComplete="given-name"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="last-name"
                                        className="block text-sm/6 font-semibold text-gray-900"
                                    >
                                        {t('landing.Uzvārds')}
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            id="last-name"
                                            name="last-name"
                                            type="text"
                                            autoComplete="family-name"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm/6 font-semibold text-gray-900"
                                    >
                                        {t('landing.E-pasts')}
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="phone-number"
                                        className="block text-sm/6 font-semibold text-gray-900"
                                    >
                                        {t('landing.Telefona numurs')}
                                    </label>
                                    <div className="mt-2.5">
                                        <input
                                            id="phone-number"
                                            name="phone-number"
                                            type="tel"
                                            autoComplete="tel"
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="message"
                                        className="block text-sm/6 font-semibold text-gray-900"
                                    >
                                        {t('landing.Jautājums')}
                                    </label>
                                    <div className="mt-2.5">
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                            defaultValue={''}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {t('landing.Sūtīt ziņojumu')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Container>
    );
};
