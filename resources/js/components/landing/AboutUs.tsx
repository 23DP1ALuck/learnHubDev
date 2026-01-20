export const AboutUs = () => {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                            Par mums
                        </h2>
                        <h2 className="text-2xl font-medium tracking-tight text-pretty text-gray-900 sm:text-5xl">
                            Sakārtot mācības skolās un kursos - labāk nekā jebkad!
                        </h2>
                    </div>
                    <p className="mt-6 text-base/7 text-gray-600">
                        LearnHub piedāvā vienkāršu veidu, kā mācīties un mācīt efektīvāk.
                        Darbi, mācību materiāli un atzīmes vienmēr ir vienuviet — pārskatāmi un viegli parvaldāmi
                    </p>
                </div>
                <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
                    <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
                        <p className="flex-none text-3xl font-bold tracking-tight text-gray-900">25 000+</p>
                        <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                            <p className="text-lg font-semibold tracking-tight text-gray-900">Studenti un pasniedzēji</p>
                            <p className="mt-2 text-base/7 text-gray-600">LearnHub katru dienu palīdz mācīties un mācīt vienuviet — ar uzdevumiem, materiāliem un ērtu saziņu.</p>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
                        <p className="flex-none text-3xl font-bold tracking-tight text-white">150+</p>
                        <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                            <p className="text-lg font-semibold tracking-tight text-white">
                                Organizācijas izmanto LearnHub
                            </p>
                            <p className="mt-2 text-base/7 text-gray-400">
                                Skolas un kursi izvēlas LearnHub, jo sistēma ir pārskatāma, ātra un viegli ieviešama ikdienas mācību darbā.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-indigo-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
                        <p className="flex-none text-3xl font-bold tracking-tight text-white">4.7</p>
                        <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                            <p className="text-lg font-semibold tracking-tight text-white">Vidējais vertējums</p>
                            <p className="mt-2 text-base/7 text-indigo-200">
                                Balstīts uz tūkstošiem atsauksmju — lietotāji novērtē vienkāršu navigāciju, termiņu pārskatāmību un skaidru vērtēšanu.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
