const fs = require('fs')

let code = fs.readFileSync('src/types.ts', 'utf8')

code = code.replace(
  `  textSize: 'normal' | 'large' | 'xlarge'`,
  `  textSize: '16px' | '18px' | '20px' | '22px' | '24px' | '26px'`
)

code = code.replace(
  `  iconSize: 'small' | 'medium' | 'large'`,
  `  iconSize: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'`
)

code = code.replace(
  `  textSize: 'normal',`,
  `  textSize: '16px',`
)

fs.writeFileSync('src/types.ts', code)
