import { db } from "#/db"
import { config, patients, surgeries, visits } from "#/db/schema"
import { createServerFn } from "@tanstack/react-start"
import { asc, desc, eq, ne, or, sql } from "drizzle-orm"
import type {
  AddPatientSurgeryZI,
  AddPatientTypeZI,
  AddPatientVisitZI,
  PatientInfoTypeZI,
  PatientSurgeryZI,
  PatientVisitTypeZI,
} from "../types/zod"

export const changeDBThemeServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { theme: "light" | "dark" }) => data)
  .handler(async ({ data: { theme } }) => {
    await db.update(config).set({ theme }).where(eq(config.id, 1))
  })

export const fetchContextServerFn = createServerFn().handler(async () => {
  const result = await db
    .select({ theme: config.theme })
    .from(config)
    .where(eq(config.id, 1))

  if (result.length === 0) return null
  return result[0].theme
})

// ########################################
// Patient CRUD
// ########################################

// get
export const fetchPatientInfoServerFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    const patient_id = Number(id)
    const result = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patient_id))
    if (result.length === 0) return null
    const patient = result[0]
    const patient_visits = await db
      .select({
        visitDate: visits.visitDate,
        visitId: visits.visitId,
      })
      .from(visits)
      .where(eq(visits.patientId, patient_id))
      .orderBy(asc(visits.visitDate))

    const patient_surgeries = await db
      .select({
        surgeriesDate: surgeries.date,
        surgeryId: surgeries.surgeryId,
      })
      .from(surgeries)
      .where(eq(surgeries.patientId, patient_id))
      .orderBy(asc(surgeries.date))

    return { patient, patient_visits, patient_surgeries }
  })

// post

export const addPatientServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: AddPatientTypeZI) => data)
  .handler(
    async ({
      data: {
        address,
        gender,
        name,
        phone,
        // treatment,
        // investigations,
        // fees,
        // visitCause,
        // visitNotes,
        // returnDate,
        pastMedicalHistory,
        pastSurgicalHistory,
        notes,
        dateOfBirth,
        FirstTimeLocation,
      },
    }) => {
      const results = await db
        .insert(patients)
        .values({
          FirstTimeLocation,
          name,
          address,
          gender,
          notes,
          phone,
          dateOfBirth,
          pastMedicalHistory,
          pastSurgicalHistory,
        })
        .returning({
          id: patients.id,
        })
      return String(results[0].id)
    },
  )

// put
export const changePatientInfoServerFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: PatientInfoTypeZI) => data)
  .handler(async ({ data }) => {
    const patient_id = Number(data.id)
    await db.update(patients).set(data).where(eq(patients.id, patient_id))
  })
// delete
export const deletePatientServerFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data: { id } }) => {
    await db.delete(patients).where(eq(patients.id, Number(id)))
  })

export const getPatientVisitInfoServerFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: { visitId: string }) => data)
  .handler(async ({ data }) => {
    const visitId = Number(data.visitId)
    const results = await db
      .select()
      .from(visits)
      .where(eq(visits.visitId, visitId))
    if (results.length === 0) return null
    return results[0]
  })

export const changePatientVisitInfoServerFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: PatientVisitTypeZI) => data)
  .handler(async ({ data }) => {
    const visitId = Number(data.visitId)
    await db.update(visits).set(data).where(eq(visits.visitId, visitId))
  })

export const addPatientVisitInfoServerFn = createServerFn({
  method: "POST",
})
  .inputValidator(
    (data: { visit: AddPatientVisitZI; patientId: number }) => data,
  )
  .handler(
    async ({
      data: {
        patientId,
        visit: {
          fees,
          investigations,
          notes,
          returnDate,
          treatment,
          visitCause,
        },
      },
    }) => {
      await db.insert(visits).values({
        patientId,
        visitDate: new Date().toISOString().split("T")[0],
        visitCause,
        investigations,
        treatment,
        notes,
        fees,
        returnDate,
      })
    },
  )

export const deleteVisitServerFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: { visitId: string }) => data)
  .handler(async ({ data: { visitId } }) => {
    await db.delete(visits).where(eq(visits.visitId, Number(visitId)))
  })

// wqeffffffffffffffffffffffffffffffffffffffff
export const getPatientSurgeryInfoServerFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: { surgeryId: string }) => data)
  .handler(async ({ data }) => {
    const surgeryId = Number(data.surgeryId)
    const results = await db
      .select()
      .from(surgeries)
      .where(eq(surgeries.surgeryId, surgeryId))
    if (results.length === 0) return null
    return results[0]
  })

export const changePatientSurgeryInfoServerFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: PatientSurgeryZI) => data)
  .handler(async ({ data }) => {
    const visitId = Number(data.surgeryId)
    await db.update(surgeries).set(data).where(eq(surgeries.surgeryId, visitId))
  })

export const addPatientSurgeryInfoServerFn = createServerFn({
  method: "POST",
})
  .inputValidator(
    (data: { surgery: AddPatientSurgeryZI; patientId: number }) => data,
  )
  .handler(
    async ({
      data: {
        patientId,
        surgery: { cause, date, fees, location, notes, returnDate, type },
      },
    }) => {
      await db.insert(surgeries).values({
        patientId,
        date,
        location,
        type,
        cause,
        returnDate,
        notes,
        fees,
      })
    },
  )

export const deleteSurgeryServerFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: { surgeryId: string }) => data)
  .handler(async ({ data: { surgeryId } }) => {
    await db.delete(surgeries).where(eq(surgeries.surgeryId, Number(surgeryId)))
  })

export const getAllPatientsServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  return await db
    .select({
      patientId: patients.id,
      name: patients.name,
      gender: patients.gender,
      dateOfBirth: patients.dateOfBirth,
      phone: patients.phone,
      address: patients.address,
      FirstTimeLocation: patients.FirstTimeLocation,
      visitCount: sql<number>`
      (
        SELECT COUNT(*)
        FROM ${visits}
        WHERE ${visits.patientId} = ${patients.id}
      )
    `,
      lastVisitId: sql<number | null>`
      (
        SELECT ${visits.visitId}
        FROM ${visits}
        WHERE ${visits.patientId} = ${patients.id}
        ORDER BY ${visits.visitDate} DESC, ${visits.visitId} DESC
        LIMIT 1
      )
    `,
      lastVisitDate: sql<Date | null>`
      (
        SELECT MAX(${visits.visitDate})
        FROM ${visits}
        WHERE ${visits.patientId} = ${patients.id}
      )
    `,
      surgeryCount: sql<number>`
      (
        SELECT COUNT(*)
        FROM ${surgeries}
        WHERE ${surgeries.patientId} = ${patients.id}
      )
    `,
      lastSurgeryId: sql<number | null>`
      (
        SELECT ${surgeries.surgeryId}
        FROM ${surgeries}
        WHERE ${surgeries.patientId} = ${patients.id}
        ORDER BY ${surgeries.date} DESC, ${surgeries.surgeryId} DESC
        LIMIT 1
      )
    `,
      lastSurgeryDate: sql<Date | null>`
      (
        SELECT MAX(${surgeries.date})
        FROM ${surgeries}
        WHERE ${surgeries.patientId} = ${patients.id}
      )
    `,
      lastReturnDate: sql<Date | null>`
(
  SELECT return_date
  FROM (

    SELECT ${visits.returnDate} AS return_date
    FROM ${visits}
    WHERE ${visits.patientId} = ${patients.id}
      AND ${visits.returnDate} IS NOT NULL

    UNION ALL

    SELECT ${surgeries.returnDate} AS return_date
    FROM ${surgeries}
    WHERE ${surgeries.patientId} = ${patients.id}
      AND ${surgeries.returnDate} IS NOT NULL

  ) combined_returns

  ORDER BY return_date DESC
  LIMIT 1
)
`,
      // lastReturnDate
      lastReturnSource: sql<"visit" | "surgery" | null>`
(
  SELECT source
  FROM (

    SELECT
      ${visits.returnDate} AS return_date,
      'visit' AS source
    FROM ${visits}
    WHERE ${visits.patientId} = ${patients.id}
      AND ${visits.returnDate} IS NOT NULL

    UNION ALL

    SELECT
      ${surgeries.returnDate} AS return_date,
      'surgery' AS source
    FROM ${surgeries}
    WHERE ${surgeries.patientId} = ${patients.id}
      AND ${surgeries.returnDate} IS NOT NULL

  ) combined_returns

  ORDER BY return_date DESC
  LIMIT 1
)
`,
      // lastReturnDate
      lastReturnId: sql<number | null>`
(
  SELECT source
  FROM (

    SELECT
      ${visits.returnDate} AS return_date,
      ${visits.visitId} AS source
    FROM ${visits}
    WHERE ${visits.patientId} = ${patients.id}
      AND ${visits.returnDate} IS NOT NULL

    UNION ALL

    SELECT
      ${surgeries.returnDate} AS return_date,
      ${surgeries.surgeryId} AS source
    FROM ${surgeries}
    WHERE ${surgeries.patientId} = ${patients.id}
      AND ${surgeries.returnDate} IS NOT NULL

  ) combined_returns

  ORDER BY return_date DESC
  LIMIT 1
)
`,
      // =========================
      // TOTAL FEES
      // =========================

      totalFees: sql<number>`
      COALESCE(
        (
          SELECT SUM(${visits.fees})
          FROM ${visits}
          WHERE ${visits.patientId} = ${patients.id}
        ),
        0
      )
      +
      COALESCE(
        (
          SELECT SUM(${surgeries.fees})
          FROM ${surgeries}
          WHERE ${surgeries.patientId} = ${patients.id}
        ),
        0
      )
    `,
      patientStatus: sql<"Complete" | "Active" | "Follow-Up Due" | "Pending">`
CASE

  -- No return date
  WHEN (
    SELECT return_date
    FROM (

      SELECT ${visits.returnDate} AS return_date
      FROM ${visits}
      WHERE ${visits.patientId} = ${patients.id}
        AND ${visits.returnDate} IS NOT NULL

      UNION ALL

      SELECT ${surgeries.returnDate} AS return_date
      FROM ${surgeries}
      WHERE ${surgeries.patientId} = ${patients.id}
        AND ${surgeries.returnDate} IS NOT NULL

    ) combined_returns

    ORDER BY return_date DESC
    LIMIT 1
  ) IS NULL
  THEN 'Complete'

  -- Return date is today
  WHEN (
    SELECT return_date
    FROM (

      SELECT ${visits.returnDate} AS return_date
      FROM ${visits}
      WHERE ${visits.patientId} = ${patients.id}
        AND ${visits.returnDate} IS NOT NULL

      UNION ALL

      SELECT ${surgeries.returnDate} AS return_date
      FROM ${surgeries}
      WHERE ${surgeries.patientId} = ${patients.id}
        AND ${surgeries.returnDate} IS NOT NULL

    ) combined_returns

    ORDER BY return_date DESC
    LIMIT 1
  ) = CURRENT_DATE
  THEN 'Active'

  -- Return date already passed
  WHEN (
    SELECT return_date
    FROM (

      SELECT ${visits.returnDate} AS return_date
      FROM ${visits}
      WHERE ${visits.patientId} = ${patients.id}
        AND ${visits.returnDate} IS NOT NULL

      UNION ALL

      SELECT ${surgeries.returnDate} AS return_date
      FROM ${surgeries}
      WHERE ${surgeries.patientId} = ${patients.id}
        AND ${surgeries.returnDate} IS NOT NULL

    ) combined_returns

    ORDER BY return_date DESC
    LIMIT 1
  ) < CURRENT_DATE
  THEN 'Follow-Up Due'

  -- Future date
  ELSE 'Pending'

END
`,
    })
    .from(patients)
    .orderBy(asc(patients.id))
})

export const fetchPasswordAndVisitsServerFn = createServerFn().handler(
  async () => {
    const results = await db.transaction(async (tx) => {
      const todaysVisits = await tx
        .selectDistinct({
          id: patients.id,
          name: patients.name,
        })
        .from(patients)
        .leftJoin(visits, eq(visits.patientId, patients.id))
        .leftJoin(surgeries, eq(surgeries.patientId, patients.id))
        .where(
          or(
            eq(visits.returnDate, sql`CURRENT_DATE`),
            eq(surgeries.returnDate, sql`CURRENT_DATE`),
          ),
        )

      const todaysSurgeries = await tx
        .selectDistinct({
          patientId: patients.id,
          name: patients.name,
          surgeryId: surgeries.surgeryId,
        })
        .from(patients)
        .innerJoin(surgeries, eq(surgeries.patientId, patients.id))
        .where(eq(surgeries.date, sql`CURRENT_DATE`))
      const password = (
        await tx
          .select({ password: config.password })
          .from(config)
          .where(eq(config.id, 1))
      )[0].password
      return { visits: todaysVisits, password, surgeries: todaysSurgeries }
    })
    return results
  },
)

export const getAllSurgeriesServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  return await db
    .select({
      patientId: patients.id,
      name: patients.name,
      gender: patients.gender,
      dateOfBirth: patients.dateOfBirth,
      phone: patients.phone,
      FirstTimeLocation: patients.FirstTimeLocation,
      surgeryId: surgeries.surgeryId,
      surgeryType: surgeries.type,
      surgeryDate: surgeries.date,
      surgeryLocation: surgeries.location,
      totalFees: surgeries.fees,
      patientStatus: sql<"Active" | "Complete" | "Pending">`
        CASE
          -- Upcoming return date
          WHEN ${surgeries.date} IS NOT NULL
            AND ${surgeries.date} > CURRENT_DATE
          THEN 'Pending'

          -- Upcoming return date
          WHEN ${surgeries.date} IS NOT NULL
            AND ${surgeries.date} = CURRENT_DATE
          THEN 'Active'

          -- No return date
          ELSE 'Complete'

        END
      `,
    })
    .from(surgeries)
    .innerJoin(patients, eq(surgeries.patientId, patients.id))
    .orderBy(desc(surgeries.date))
})

export const getAllVisitsServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  return await db
    .select({
      patientId: patients.id,
      name: patients.name,
      gender: patients.gender,
      dateOfBirth: patients.dateOfBirth,
      phone: patients.phone,
      FirstTimeLocation: patients.FirstTimeLocation,
      visitId: visits.visitId,
      visitDate: visits.visitDate,
      returnDate: visits.returnDate,
      totalFees: visits.fees,
      patientStatus: sql<"Active" | "Complete" | "Pending" | "Follow-Up Due">`
        CASE
          -- Upcoming return date
          WHEN ${visits.returnDate} IS NOT NULL
            AND ${visits.returnDate} > CURRENT_DATE
          THEN 'Pending'

          -- Upcoming return date
          WHEN ${visits.returnDate} IS NOT NULL
            AND ${visits.returnDate} = CURRENT_DATE
          THEN 'Active'

          -- Upcoming return date
          WHEN ${visits.returnDate} IS NOT NULL
            AND ${visits.returnDate} < CURRENT_DATE
          THEN 'Follow-Up Due'

          -- No return date
          ELSE 'Complete'

        END
      `,
    })
    .from(visits)
    .innerJoin(patients, eq(visits.patientId, patients.id))
    .orderBy(desc(visits.visitDate))
})

// dasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdadsdasasdads
export const financeServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const [visitsDashboard] = await db
    .select({
      todayFees: sql<number>`
        COALESCE(
          SUM(${visits.fees})
          FILTER (
            WHERE ${visits.visitDate} = CURRENT_DATE
          ),
          0
        )::int
      `,

      weekFees: sql<number>`
        COALESCE(
          SUM(${visits.fees})
          FILTER (
            WHERE DATE_TRUNC('week', ${visits.visitDate})
            =
            DATE_TRUNC('week', CURRENT_DATE)
          ),
          0
        )::int
      `,

      monthFees: sql<number>`
        COALESCE(
          SUM(${visits.fees})
          FILTER (
            WHERE DATE_TRUNC('month', ${visits.visitDate})
            =
            DATE_TRUNC('month', CURRENT_DATE)
          ),
          0
        )::int
      `,

      yearFees: sql<number>`
        COALESCE(
          SUM(${visits.fees})
          FILTER (
            WHERE DATE_TRUNC('year', ${visits.visitDate})
            =
            DATE_TRUNC('year', CURRENT_DATE)
          ),
          0
        )::int
      `,

      totalFees: sql<number>`
        COALESCE(
          SUM(${visits.fees}),
          0
        )::int
      `,
    })
    .from(visits)

  // =========================================
  // SURGERIES DASHBOARD
  // =========================================

  const [surgeriesDashboard] = await db
    .select({
      todayFees: sql<number>`
        COALESCE(
          SUM(${surgeries.fees})
          FILTER (
            WHERE ${surgeries.date} = CURRENT_DATE
          ),
          0
        )::int
      `,

      weekFees: sql<number>`
        COALESCE(
          SUM(${surgeries.fees})
          FILTER (
            WHERE DATE_TRUNC('week', ${surgeries.date})
            =
            DATE_TRUNC('week', CURRENT_DATE)
          ),
          0
        )::int
      `,

      monthFees: sql<number>`
        COALESCE(
          SUM(${surgeries.fees})
          FILTER (
            WHERE DATE_TRUNC('month', ${surgeries.date})
            =
            DATE_TRUNC('month', CURRENT_DATE)
          ),
          0
        )::int
      `,

      yearFees: sql<number>`
        COALESCE(
          SUM(${surgeries.fees})
          FILTER (
            WHERE DATE_TRUNC('year', ${surgeries.date})
            =
            DATE_TRUNC('year', CURRENT_DATE)
          ),
          0
        )::int
      `,

      totalFees: sql<number>`
        COALESCE(
          SUM(${surgeries.fees}),
          0
        )::int
      `,
    })
    .from(surgeries)
    .where(ne(surgeries.location, "Al-Yarmuk Teaching Hospital"))

  // =========================================
  // RAW FINANCE RECORDS
  // =========================================

  const visitRecords = await db
    .select({
      type: sql<"Surgery" | "Visit">`'Visit'`,
      fee: visits.fees,
      date: visits.visitDate,
    })
    .from(visits)
    .innerJoin(patients, sql`${patients.id} = ${visits.patientId}`)

  const surgeryRecords = await db
    .select({
      type: sql<"Surgery" | "Visit">`'Surgery'`,
      fee: surgeries.fees,
      date: surgeries.date,
    })
    .from(surgeries)
    .innerJoin(patients, sql`${patients.id} = ${surgeries.patientId}`)
    .where(ne(surgeries.location, "Al-Yarmuk Teaching Hospital"))

  // =========================================
  // MERGE RECORDS
  // =========================================

  const records = [...visitRecords, ...surgeryRecords]

  // =========================================
  // FINAL DASHBOARD
  // =========================================

  const dashboard = [
    { type: "Visit" as "Visit" | "Surgeries" | "Total", ...visitsDashboard },
    {
      type: "Surgeries" as "Visit" | "Surgeries" | "Total",
      ...surgeriesDashboard,
    },
    {
      type: "Total" as "Visit" | "Surgeries" | "Total",
      todayFees: visitsDashboard.todayFees + surgeriesDashboard.todayFees,

      weekFees: visitsDashboard.weekFees + surgeriesDashboard.weekFees,

      monthFees: visitsDashboard.monthFees + surgeriesDashboard.monthFees,

      yearFees: visitsDashboard.yearFees + surgeriesDashboard.yearFees,

      totalFees: visitsDashboard.totalFees + surgeriesDashboard.totalFees,
    },
  ]

  return {
    dashboard,
    records,
  }
})
