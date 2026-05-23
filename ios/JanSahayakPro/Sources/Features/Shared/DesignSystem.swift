import SwiftUI

enum ProPalette {
    static let background = Color(red: 9/255, green: 16/255, blue: 31/255)
    static let surface = Color(red: 16/255, green: 23/255, blue: 36/255)
    static let card = Color(red: 24/255, green: 32/255, blue: 48/255)
    static let border = Color(red: 28/255, green: 43/255, blue: 70/255)
    static let accent = Color(red: 232/255, green: 162/255, blue: 67/255)
    static let green = Color(red: 76/255, green: 175/255, blue: 130/255)
    static let red = Color(red: 224/255, green: 92/255, blue: 92/255)
    static let blue = Color(red: 74/255, green: 144/255, blue: 217/255)
    static let purple = Color(red: 155/255, green: 114/255, blue: 207/255)
    static let text = Color(red: 203/255, green: 216/255, blue: 237/255)
    static let dim = Color(red: 98/255, green: 120/255, blue: 160/255)
    static let muted = Color(red: 63/255, green: 80/255, blue: 112/255)
}

struct ProCard<Content: View>: View {
    let title: String?
    @ViewBuilder var content: Content

    init(title: String? = nil, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            if let title {
                Text(title)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .textCase(.uppercase)
                    .foregroundStyle(ProPalette.accent)
                    .tracking(1.2)
            }

            content
        }
        .padding(18)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(ProPalette.card)
                .overlay(
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .stroke(ProPalette.border.opacity(0.7), lineWidth: 1)
                )
        )
    }
}

struct StatTile: View {
    let title: String
    let value: String
    let icon: String
    let tint: Color

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(tint)
                .frame(width: 38, height: 38)
                .background(tint.opacity(0.14), in: RoundedRectangle(cornerRadius: 12, style: .continuous))

            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.headline)
                    .foregroundStyle(ProPalette.text)
                Text(title)
                    .font(.caption)
                    .foregroundStyle(ProPalette.dim)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(ProPalette.surface)
        )
    }
}

struct TagChip: View {
    let text: String
    let tint: Color

    var body: some View {
        Text(text)
            .font(.caption.bold())
            .foregroundStyle(tint)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(
                Capsule(style: .continuous)
                    .fill(tint.opacity(0.14))
            )
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption.bold())
                .foregroundStyle(isSelected ? Color.black : ProPalette.text)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(
                    Capsule(style: .continuous)
                        .fill(isSelected ? ProPalette.accent : ProPalette.surface)
                )
        }
        .buttonStyle(.plain)
    }
}

struct GeneratedTextCard: View {
    let title: String
    let text: String

    var body: some View {
        ProCard(title: title) {
            if text.isEmpty {
                Text("Generate the activity pack to populate this section.")
                    .font(.subheadline)
                    .foregroundStyle(ProPalette.dim)
            } else {
                Text(text)
                    .font(.subheadline)
                    .foregroundStyle(ProPalette.text)
                    .textSelection(.enabled)
            }
        }
    }
}

struct EmptyStateView: View {
    let title: String
    let copy: String

    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: "tray")
                .font(.system(size: 28))
                .foregroundStyle(ProPalette.dim)
            Text(title)
                .font(.headline)
                .foregroundStyle(ProPalette.text)
            Text(copy)
                .font(.subheadline)
                .multilineTextAlignment(.center)
                .foregroundStyle(ProPalette.dim)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 32)
    }
}

struct AttachmentRow: View {
    let attachment: AttachmentRecord

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(attachment.fileName)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(ProPalette.text)
                Text(attachment.fileSizeLabel)
                    .font(.caption)
                    .foregroundStyle(ProPalette.dim)
            }

            Spacer()

            if let fileURL = DocumentVault.localURL(for: attachment) {
                ShareLink(item: fileURL) {
                    Image(systemName: "square.and.arrow.up")
                        .foregroundStyle(ProPalette.accent)
                }
            }
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(ProPalette.surface)
        )
    }
}

extension View {
    func proScreenBackground() -> some View {
        background(ProPalette.background.ignoresSafeArea())
            .tint(ProPalette.accent)
    }
}

enum Formatters {
    static let currency: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "INR"
        formatter.maximumFractionDigits = 0
        return formatter
    }()

    static let date: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter
    }()

    static let month: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM yyyy"
        return formatter
    }()
}

func formatCurrency(_ value: Decimal) -> String {
    Formatters.currency.string(from: value as NSDecimalNumber) ?? "₹0"
}

func formatDate(_ date: Date) -> String {
    Formatters.date.string(from: date)
}
