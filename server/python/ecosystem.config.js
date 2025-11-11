module.exports = {
  apps: [
    {
      name: "python-api",
      script: "venv/bin/uvicorn",
      args: "app:app --host 0.0.0.0 --port 10000",
      cwd: "/root/opportune/server/python",
      interpreter: "none"
    }
  ]
}
