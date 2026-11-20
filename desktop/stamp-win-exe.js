// Stamp Crownfall.exe with version info and icon using resedit (pure JS, no Wine, no packer).
const fs = require("fs");
const path = require("path");
const ResEdit = require("resedit");

const exePath = process.argv[2] || path.join(__dirname, "dist", "win-unpacked", "Crownfall.exe");
const icoPath = process.argv[3] || path.join(__dirname, "icon.ico");
const version4 = "2.0.1.0";
const [maj, min, pat, bld] = version4.split(".").map((n) => parseInt(n, 10));

const exe = ResEdit.NtExecutable.from(fs.readFileSync(exePath), { ignoreCert: true });
const res = ResEdit.NtExecutableResource.from(exe);

const iconFile = ResEdit.Data.IconFile.from(fs.readFileSync(icoPath));
const existingGroups = ResEdit.Resource.IconGroupEntry.fromEntries(res.entries);
const iconId = existingGroups.length ? existingGroups[0].id : 1;
ResEdit.Resource.IconGroupEntry.replaceIconsForResource(
  res.entries,
  iconId,
  1033,
  iconFile.icons.map((item) => item.data)
);

const viList = ResEdit.Resource.VersionInfo.fromEntries(res.entries);
const vi = viList[0] || ResEdit.Resource.VersionInfo.createEmpty();
vi.setFileVersion(maj, min, pat, bld, 1033);
vi.setProductVersion(maj, min, pat, bld, 1033);
vi.setStringValues(
  { lang: 1033, codepage: 1200 },
  {
    CompanyName: "Weston Langer",
    FileDescription: "Crownfall — a world-conquest strategy game",
    FileVersion: version4,
    InternalName: "Crownfall",
    LegalCopyright: "Copyright © 2026 Weston Langer",
    OriginalFilename: "Crownfall.exe",
    ProductName: "Crownfall",
    ProductVersion: version4
  }
);
vi.outputToResourceEntries(res.entries);

res.outputResource(exe, true);
fs.writeFileSync(exePath, Buffer.from(exe.generate()));
console.log("stamped", exePath);
console.log("icon group id", iconId, "icons", iconFile.icons.length);
console.log("version", version4, "company Weston Langer, product Crownfall");
