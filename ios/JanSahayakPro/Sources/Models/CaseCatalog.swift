import Foundation

enum CaseCatalog {
    static let biharDistricts: [String] = [
        "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur",
        "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui",
        "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai",
        "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada",
        "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura",
        "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran",
    ]

    static let courtOptions: [String] = [
        "Supreme Court of India",
        "Patna High Court",
    ] + biharDistricts.map { "District Court, \($0)" } + [
        "Sessions Court, Purnia",
        "Sessions Court, Patna",
        "JMFC, Purnia",
        "JMFC, Patna",
        "CJM, Purnia",
        "CJM, Patna",
        "Family Court, Patna",
        "Family Court, Purnia",
        "POCSO Court, Purnia",
        "POCSO Court, Patna",
    ]

    static let activityTypes: [String] = [
        "Legal Aid Camp",
        "PLV Training",
        "District Consultation",
        "State Consultation",
        "Community Meeting",
        "Legal Literacy Session",
        "Media Briefing",
        "Advocacy Delegation",
    ]

    static let supremeCourtCaseTypes: [String] = [
        "SPECIAL LEAVE PETITION (CIVIL)",
        "SPECIAL LEAVE PETITION (CRIMINAL)",
        "CIVIL APPEAL",
        "CRIMINAL APPEAL",
        "WRIT PETITION (CIVIL)",
        "WRIT PETITION(CRIMINAL)",
        "TRANSFER PETITION (CIVIL)",
        "TRANSFER PETITION (CRIMINAL)",
        "REVIEW PETITION (CIVIL)",
        "REVIEW PETITION (CRIMINAL)",
        "TRANSFERRED CASE (CIVIL)",
        "TRANSFERRED CASE (CRIMINAL)",
        "ORIGINAL SUIT",
        "DEATH REFERENCE CASE",
        "CONTEMPT PETITION (CIVIL)",
        "CONTEMPT PETITION (CRIMINAL)",
        "TAX REFERENCE CASE",
        "SPECIAL REFERENCE CASE",
        "ELECTION PETITION (CIVIL)",
        "ARBITRATION PETITION",
        "CURATIVE PETITION(CIVIL)",
        "CURATIVE PETITION(CRL)",
        "MISCELLANEOUS APPLICATION",
        "SUO MOTO WRIT PETITION(CIVIL)",
        "SUO MOTO WRIT PETITION(CRIMINAL)",
        "SUO MOTO TRANSFER PETITION(CIVIL)",
        "SUO MOTO TRANSFER PETITION(CRIMINAL)",
    ]

    static let patnaHighCourtCaseTypes: [String] = [
        "ADMIRALITY SUIT[ADM. SUIT]",
        "CERTIFICATE APPEAL[CRT. APPEAL]",
        "CIVIL MISCELLANEOUS JURISDICTION[C.Misc.]",
        "CIVIL REFERENCE[C.REF.]",
        "CIVIL REVIEW[C. REV.]",
        "CIVIL REVISION[C.R.]",
        "Civil Writ Jurisdiction Case[CWJC]",
        "COMMERCIAL APPEAL[COMMERCIAL APP]",
        "COMPANY APPEAL[COMP. APP]",
        "COMPANY APPLICATION[COMP. APPLIC]",
        "COMPANY PETITION[COMP PET]",
        "ELECTION PETITION[E.P.]",
        "FIRST APPEAL[FA]",
        "Letters Patent Appeal[L.P.A]",
        "MATRIMONIAL REF.[MAT. REF.]",
        "MATRIMONIAL SUIT[MAT. SUIT]",
        "Miscellaneous Appeal[MA]",
        "Miscellaneous Jurisdiction Case[MJC]",
        "MONEY SUIT[MONEY SUIT]",
        "SECOND APPEAL[SA]",
        "SPECIAL LEAVE PETITION[SLP]",
        "SUPREME COURT APPEAL[SCA]",
        "TAX CASES[TAX]",
        "TEST CASE[TEST CASE]",
        "TEST SUIT[TEST SUIT]",
        "TITLE SUIT[T.S.]",
        "CRIMINAL APPEAL (DB)[CR. APP (DB)]",
        "CRIMINAL APPEAL (SJ)[CR. APP (SJ)]",
        "CRIMINAL APPEAL (U/S)[CR.APP(U/S)]",
        "CRIMINAL MISCELLANEOUS[CR. MISC.]",
        "CRIMINAL REFERENCE[CR. REF.]",
        "CRIMINAL REVISION[CR. REV.]",
        "Criminal Writ Jurisdiction Case[CR. WJC]",
        "DEATH REFERENCE[D. REF.]",
        "GOVT. APPEAL (DB)[G. APP. (DB)]",
        "GOVT. APPEAL (SJ)[G.APP.(SJ)]",
        "SPECIAL LEAVE APPLICATION[SLA]",
    ]

    static let biharECourtsCaseTypes: [String] = [
        "Anticipatory Bail",
        "Regular Bail",
        "Title Suit",
        "Title Appeal",
        "Commercial Suit",
        "Commercial Appeal",
        "Commercial Disputes Case",
        "Domestic Violence Act 2005",
        "Spl. Case (P.O.C.S.O. Act.)",
        "Spl. Case (SC / ST Act)",
        "MATRIMONIAL CASE",
        "SUCCESSION",
        "PROBATE CASE",
        "LAND ACQ. CASES",
        "Execution",
        "Claim Case",
        "CLAIM CASES",
        "Cr. Appeal",
        "Cr. Case",
        "Cr. Miscellaneous",
        "Cr. Rev.",
        "Cri. BAIL APPLN.",
        "Cri. Misc. Complaint",
        "Regular Petition",
        "MONEY SUIT",
        "RENT SUIT",
        "PARTITION SUIT",
        "Probate Case",
        "Guardianship",
        "Guardian & Wards Case",
        "Domestic Violence Misc. u/s 31",
        "D.V. appeal",
        "NDPS Spl. Case",
        "P.C. Act",
        "Indian Penal Code (IPC)",
        "Excise Act",
    ]

    static func caseTypes(for court: String) -> [String] {
        switch court {
        case "Supreme Court of India":
            return supremeCourtCaseTypes
        case "Patna High Court":
            return patnaHighCourtCaseTypes
        default:
            return biharECourtsCaseTypes
        }
    }

    static func source(for court: String) -> String {
        switch court {
        case "Supreme Court of India":
            return "Official Supreme Court of India case-status catalog"
        case "Patna High Court":
            return "Official Patna High Court filing and case-status catalog"
        default:
            return "Official Bihar district eCourts case-type catalog"
        }
    }

    static func defaultCaseType(for court: String) -> String {
        caseTypes(for: court).first ?? "Title Suit"
    }
}
