import { db } from "./client.ts"
import { fakerPT_BR as faker } from "@faker-js/faker"
import { courses, enrollments, users } from "./schema.ts"

async function seed() {

    const usersInsert = await db.insert(users).values([
        {name: faker.person.firstName(), email: faker.internet.email()},
        {name: faker.person.firstName(), email: faker.internet.email()},
        {name: faker.person.firstName(), email: faker.internet.email()},
        {name: faker.person.firstName(), email: faker.internet.email()},
        {name: faker.person.firstName(), email: faker.internet.email()},
        {name: faker.person.firstName(), email: faker.internet.email()},
        {name: faker.person.firstName(), email: faker.internet.email()},
    ]).returning()

    const coursesInsert = await db.insert(courses).values([
        {title: "Curso de Node.js", description: "Aprenda a criar aplicações backend com Node.js"},
        {title: "Curso de React", description: "Aprenda a criar interfaces de usuário com React"},
        {title: "Curso de TypeScript", description: "Aprenda a usar TypeScript em seus projetos"},
        {title: "Curso de Python", description: "Aprenda a programar em Python do zero"},
        {title: "Curso de Django", description: "Aprenda a criar aplicações web com Django"},
        {title: "Curso de Flask", description: "Aprenda a criar APIs com Flask"},
        {title: "Curso de Java", description: "Aprenda a programar em Java"},
        {title: "Curso de Spring Boot", description: "Aprenda a criar aplicações web com Spring Boot"},
    ]).returning()

    await db.insert(enrollments).values([
        { userId: usersInsert[0].id, courseId: coursesInsert[5].id },
        { userId: usersInsert[1].id, courseId: coursesInsert[4].id },
        { userId: usersInsert[3].id, courseId: coursesInsert[5].id },
        { userId: usersInsert[2].id, courseId: coursesInsert[7].id },
        { userId: usersInsert[5].id, courseId: coursesInsert[0].id },
        { userId: usersInsert[6].id, courseId: coursesInsert[1].id },
        { userId: usersInsert[0].id, courseId: coursesInsert[2].id },
        { userId: usersInsert[4].id, courseId: coursesInsert[3].id },
        { userId: usersInsert[5].id, courseId: coursesInsert[6].id },
        { userId: usersInsert[2].id, courseId: coursesInsert[4].id },
    ])

}

seed()