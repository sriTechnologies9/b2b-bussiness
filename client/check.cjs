const fs = require('fs');

try {
  // Use the local node_modules of the client
  const parser = require('./node_modules/@babel/parser');
  const code = fs.readFileSync('./src/pages/Home.tsx', 'utf8');
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  console.log("\n=============================================");
  console.log("SUCCESS: No syntax error found in Home.tsx!");
  console.log("=============================================\n");
} catch (err) {
  console.error("\n=============================================");
  console.error("ERROR: Syntax Error found in Home.tsx!");
  console.error("Message:", err.message);
  console.error("Location:", JSON.stringify(err.loc));
  console.log("=============================================\n");
}
