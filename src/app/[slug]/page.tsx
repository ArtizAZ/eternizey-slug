import Head from 'next/head'
import RedirectClient from './RedirectClient'
import axios from "axios";
import {JSX} from "react";

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

const authApi = process.env.AUTH_API_URL;

async function getPerson(slug: string): Promise<Person | null> {
    try {
        const loginRes = await axios.post(
            `${authApi}/api/v1/login/site`,
            {
                email: process.env.USERNAME,
                password: process.env.PASSWORD,
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

export default async function Page({ params }: PageParams): Promise<JSX.Element> {
    const { slug } = await params;

    console.log(slug);

    const person = await getPerson(slug);

    if (!person) {
        return <p>Pessoa não encontrada</p>;
    }

    return (
        <>
            <Head>
                <title>{person.name} | Eternizey</title>
                <meta property="og:title" content={`Homenagem a ${person.name}`}/>
                <meta property="og:description" content={person.biography || 'Uma homenagem eterna.'}/>
                <meta property="og:image" content={person.avatar_thumbnail}/>
                <meta property="og:url" content={`https://eternizey.com/${person.slug}`}/>
            </Head>

            <main>
                <h1>Redirecionando para homenagem de {person.name}...</h1>
                <RedirectClient slug={person.slug}/>
            </main>
        </>
    );
}
