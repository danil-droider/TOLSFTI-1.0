import re

path = r'c:/Users/Danil/Desktop/ИИ/TOLSFTI 1.0/src/components/Header.tsx'
with open(path, 'r', encoding='utf-8-sig') as f:
    content = f.read()

# Replace the import line - add computeHourlyRate import after useGoalStore
old_import = "import { useGoalStore } from '../store/useGoalStore'"
new_import = """import { useGoalStore } from '../store/useGoalStore'
import { computeHourlyRate } from '../utils/calculator'"""

new_content = content.replace(old_import, new_import)

with open(path, 'w', encoding='utf-8-sig') as f:
    f.write(new_content)

print('Fixed Header.tsx')