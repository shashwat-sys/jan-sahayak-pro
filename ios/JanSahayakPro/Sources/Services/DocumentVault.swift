import Foundation

enum DocumentVault {
    static func attachmentsDirectory() throws -> URL {
        let base = try FileManager.default.url(
            for: .applicationSupportDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )
        let folder = base.appendingPathComponent("JanSahayakProAttachments", isDirectory: true)
        if !FileManager.default.fileExists(atPath: folder.path()) {
            try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
        }
        return folder
    }

    static func importFiles(from urls: [URL]) throws -> [AttachmentRecord] {
        let directory = try attachmentsDirectory()

        return try urls.map { sourceURL in
            let didAccess = sourceURL.startAccessingSecurityScopedResource()
            defer {
                if didAccess {
                    sourceURL.stopAccessingSecurityScopedResource()
                }
            }

            let data = try Data(contentsOf: sourceURL)
            let destinationName = UUID().uuidString + "-" + sourceURL.lastPathComponent
            let destinationURL = directory.appendingPathComponent(destinationName)
            try data.write(to: destinationURL, options: .atomic)

            return AttachmentRecord(
                fileName: sourceURL.lastPathComponent,
                storedFileName: destinationName,
                sizeInBytes: data.count
            )
        }
    }

    static func localURL(for attachment: AttachmentRecord) -> URL? {
        guard let storedFileName = attachment.storedFileName else {
            return nil
        }

        return try? attachmentsDirectory().appendingPathComponent(storedFileName)
    }
}
