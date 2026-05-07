# Page snapshot

```yaml
- generic [active]:
  - alert [ref=e1]
  - dialog [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - heading "Build Error" [level=1] [ref=e7]
        - paragraph [ref=e8]: Failed to compile
      - generic [ref=e9]:
        - generic [ref=e10]:
          - link "./src/app/share/dashboard/PublicWidgetCard.tsx" [ref=e11] [cursor=pointer]:
            - text: ./src/app/share/dashboard/PublicWidgetCard.tsx
            - img [ref=e12]
          - generic [ref=e17]: "Module parse failed: Duplicate export 'PublicWidgetCard' (216:9) | } | } > export { PublicWidgetCard }; |"
        - contentinfo [ref=e18]:
          - paragraph [ref=e19]: This error occurred during the build process and can only be dismissed by fixing the error.
```