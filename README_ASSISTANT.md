Supply Chain Guardian — ALL DONE (frontend preserved + backend + ML + VSCode)

What I added:
- Injected a demo widget into the main index.html (backup created as index.html.bak_assistant).
- Added backend/ with Flask + SQLite + numpy placeholders + optional PyTorch modules.
- Added ml_models/ with simple PyTorch model definitions and a training script `train_models.py`.
  Run this to produce checkpoints: `python ml_models/train_models.py` (requires torch).
- Added .vscode/tasks.json and .vscode/launch.json for one-click setup & run.

One-click steps in VS Code:
1. Open the project folder in VS Code.
2. Run the Task: Terminal → Run Task → "Create venv" (creates .venv).
3. Activate the venv in the terminal:
   - Windows: .\.venv\Scripts\activate
   - Mac/Linux: source .venv/bin/activate
4. Run Task: "Install requirements"
5. Run Task: "Run backend" or press F5 using the "Run Flask backend" launch config.
6. Open browser to http://localhost:8000/

Notes:
- If your frontend's index.html is in a subfolder, the injection was applied to the first index.html found; backup of the original is at index.html.bak_assistant next to the injected file.
- If you want the demo removed or injected elsewhere, tell me the exact index.html path and I will revert/edit (I kept backups).
