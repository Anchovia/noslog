import { createBrandIcon } from "@/lib/metadata/brandImage";

export const size = {
    width: 180,
    height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
    return createBrandIcon(size.width);
}
