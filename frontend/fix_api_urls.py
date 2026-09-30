import os
import re

src_dir = r'd:\NeuroSense\frontend\src'
for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'fetch(' in content and '/api/' in content:
                new_content = content
                if 'import { API_BASE_URL }' not in new_content:
                    # add import at the top
                    new_content = 'import { API_BASE_URL } from "../config";\n' + new_content
                
                # replace string quotes with template literals
                new_content = re.sub(r'fetch\([\"\'\`]/api/([^\"\']+?)[\"\'\`]', r'fetch(`${API_BASE_URL}/api/\1`', new_content)
                new_content = re.sub(r'fetch\(`(/api/[^`]+)`', r'fetch(`${API_BASE_URL}\1`', new_content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {file}')
