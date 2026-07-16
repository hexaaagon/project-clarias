import { betterFetch } from "@better-fetch/fetch";
import { db, eq } from "@project-clarias/database";
import { account } from "@project-clarias/database/schema/user";
import type { User } from "better-auth";
import { auth } from ".";

export async function userRegistration(user: User) {
  const existingAccount = await db
    .select({ id: account.id })
    .from(account)
    .where(eq(account.userId, user.id))
    .limit(1);

  if (existingAccount.length > 0) {
    return;
  }

  // TODO: hack club personal data inserting thing
  // await db.insert(personalInfo).values({
  //   id: accountData.id,
  //   email: user.email,
  //   e_firstName: encryptedLoremData,
  //   e_lastName: encryptedLoremData,
  //   e_addressOne: encryptedLoremData,
  //   e_addressTwo: encryptedLoremData,
  //   e_city: encryptedLoremData,
  //   e_state: encryptedLoremData,
  //   e_country: encryptedLoremData,
  //   e_zipCode: encryptedLoremData,
  //   e_birthdate: encryptedLoremData,
  // });
}
