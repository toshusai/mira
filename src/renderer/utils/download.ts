export function download(blob: Blob, name: string) {
  const link = document.createElement("a");
  if (link.href) {
    URL.revokeObjectURL(link.href);
  }
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.dispatchEvent(new MouseEvent("click"));
}
