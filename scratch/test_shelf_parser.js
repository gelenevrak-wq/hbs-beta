const parseShelfCode = (sh) => {
  const code = (sh || "").trim();
  if (code.includes("-")) {
    const parts = code.split("-");
    return {
      zone: parts[0] || "",
      slot: parseInt(parts[1]) || 1,
      level: parts[2] ? (parseInt(parts[2]) || 1) : 1,
      side: parts[3] ? parts[3].split("-")[0] : ""
    };
  } else {
    // Format: A0101 or A0102
    const zone = code.charAt(0) || "";
    const slot = parseInt(code.substring(1, 3)) || 1;
    const level = parseInt(code.substring(3, 5)) || 1;
    const side = code.substring(5) || "";
    return { zone, slot, level, side };
  }
};

const getZoneFromShelf = (s) => {
  if (!s) return "";
  if (s.includes("-")) {
    return s.split("-")[0] || "";
  }
  return s.charAt(0) || "";
};

console.log("A0101 ->", parseShelfCode("A0101"));
console.log("A1205 ->", parseShelfCode("A1205"));
console.log("A-01-02 ->", parseShelfCode("A-01-02"));
console.log("A-01-02-S1-B2 ->", parseShelfCode("A-01-02-S1-B2"));
console.log("Zone of A0101 ->", getZoneFromShelf("A0101"));
console.log("Zone of A-01-02 ->", getZoneFromShelf("A-01-02"));
