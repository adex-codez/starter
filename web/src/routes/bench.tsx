import { ArrowRight } from "lucide-solid";
import { type ParentProps } from "solid-js";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Switch, SwitchControl, SwitchInput, SwitchLabel, SwitchThumb } from "~/components/ui/switch";

function Panel(props: ParentProps<{ title: string }>) {
  return (
    <section class="rounded-xl border border-border bg-card">
      <div class="border-b border-border/70 px-5 py-4">
        <h2 class="text-sm font-medium">{props.title}</h2>
      </div>
      <div class="p-5">{props.children}</div>
    </section>
  );
}

export default function Bench() {
  return (
    <main class="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <h1 class="font-display text-4xl">Bench</h1>
      <p class="mt-3 max-w-2xl text-muted-foreground">
        The primitive layer without product concerns. Copy a file, keep the parts you need.
      </p>

      <div class="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel title="Buttons">
          <div class="flex flex-wrap items-center gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <Button size="icon" aria-label="Continue">
              <ArrowRight />
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </Panel>

        <Panel title="Inputs">
          <div class="space-y-2">
            <Label for="bench-email">Email</Label>
            <Input id="bench-email" type="email" placeholder="you@example.com" />
          </div>
          <div class="mt-5 space-y-2">
            <Label for="bench-taken">Backup email</Label>
            <Input id="bench-taken" type="email" aria-invalid="true" value="ada@example.com" />
            <p class="text-xs text-destructive">This address is already in use.</p>
          </div>
        </Panel>

        <Panel title="Badges">
          <div class="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="signal">
              <span class="size-1.5 rounded-full bg-signal" />
              Live
            </Badge>
          </div>
        </Panel>

        <Panel title="Dialog">
          <Dialog>
            <DialogTrigger class={buttonVariants({ variant: "outline" })}>
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ship a change</DialogTitle>
                <DialogDescription>
                  Dialogs trap focus, close on escape, and return focus to the trigger.
                </DialogDescription>
              </DialogHeader>
              <div class="mt-5 space-y-2">
                <Label for="change-title">Change title</Label>
                <Input id="change-title" placeholder="Add the bench page" />
              </div>
              <DialogFooter>
                <DialogClose class={buttonVariants({ variant: "outline" })}>Cancel</DialogClose>
                <Button>Ship it</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Panel>

        <Panel title="Switch">
          <Switch defaultChecked class="flex items-start justify-between gap-6">
            <SwitchInput />
            <div>
              <SwitchLabel>Watch the route tree</SwitchLabel>
              <p class="mt-1 text-xs text-muted-foreground">
                Re-run the probe when routes change.
              </p>
            </div>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
          </Switch>
          <Separator class="my-5" />
          <p class="text-sm text-muted-foreground">Separators keep dense panels readable.</p>
        </Panel>

        <Panel title="Surfaces">
          <Card>
            <CardHeader>
              <CardTitle>Weekly digest</CardTitle>
              <CardDescription>Everything the service saw this week.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <Skeleton class="h-4 w-3/4" />
              <Skeleton class="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
              <Badge variant="signal">Draft</Badge>
            </CardFooter>
          </Card>
        </Panel>
      </div>
    </main>
  );
}
