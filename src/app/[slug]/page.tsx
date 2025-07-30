import RedirectClient from './RedirectClient'
import {Metadata} from 'next';
import axios from "axios";
import {JSX} from "react";
import {getImageS3} from "@/helpers/getImageS3";

type Person = {
    name: string;
    biography?: string;
    avatar_thumbnail: string;
    slug: string;
};

type PageParams = {
    params: Promise<{
        slug: string;
    }>;
};

const authApi = process.env.NEXT_PUBLIC_AUTH_API_URL;

async function getPerson(slug: string): Promise<Person | null> {
    try {
        const loginRes = await axios.post(
            `${authApi}/api/v1/login/site`,
            {
                email: process.env.NEXT_PUBLIC_USERNAME,
                password: process.env.NEXT_PUBLIC_PASSWORD,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const token = loginRes.data.access_token;

        console.log(token);

        const personRes = await axios.get(`${authApi}/api/v1/immortalized_person/site/${slug}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(personRes.data.immortalized_person);
        return personRes.data.immortalized_person;

    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function generateMetadata({params}: PageParams): Promise<Metadata> {
    const {slug} = await params;

    const person = await getPerson(slug);

    if (!person) {
        return {
            title: 'Pessoa não encontrada | Eternizey',
        };
    }

    const cleanBiography = (person.biography ?? "Uma homenagem eterna.").replace(/["']/g, "");

    return {
        title: `${person.name} | Eternizey`,
        description: person.biography ?? 'Uma homenagem eterna.',
        openGraph: {
            title: `Homenagem a ${person.name}`,
            description: cleanBiography ?? 'Uma homenagem eterna.',
            images: getImageS3(person.avatar_thumbnail) ?? '/compartilhamento.webp',
            url: `https://eternizey.com/${person.slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: `Homenagem a ${person.name}`,
            description: cleanBiography,
            images: getImageS3(person.avatar_thumbnail) ?? '/compartilhamento.webp',
            site: "@eternizey", // (opcional) substitua pelo seu @ no Twitter
            creator: "@eternizey", // (opcional) substitua pelo autor
        },
    };
}

export default async function Page({params}: PageParams): Promise<JSX.Element> {
    const {slug} = await params;

    console.log('slug', slug);
    console.log('process.env.USERNAME', process.env.USERNAME);
    console.log('process.env.PASSWORD', process.env.PASSWORD);

    const person = await getPerson(slug);

    if (!person) {
        return <p>{slug}: Pessoa não encontrada</p>;
    }

    return (
        <body>
            <main>
                {/*<h1>Redirecionando para homenagem de {person.name}...</h1>*/}
                {/* Ativa se quiser redirecionamento no client */}
                 <RedirectClient slug={person.slug} />
            </main>
        </body>
    );
}
