import type { Task, TaskStatus, Workflow } from "./domain";
import { //canEnterWip,
    canTransition, startSLAIfNeeded } from "./domain";
export function moveTaskDomain(
    task: Task,
    to: TaskStatus,
    workflow: Workflow
): { next?: Task; error?: string } {
    if (!canTransition(task.status, to)) {
        return { error: `Transition ${task.status} → ${to} заборонено за поточним workflow` };
    }

    const targetCol = workflow.columns.find(c => c.id === to);
    if (!targetCol) return { error: `Колонка ${to} відсутня у workflow` };

    // WIP рахуємо зовні у slice (бо треба знати поточну кількість у колонці)
    // Тут тільки перевіряємо наявність ліміту; саме число прийде в slice як currentCount.

    // Повертаємо оновлену задачу (без зміни updatedAt — хай slice поставить)
    let next = { ...task, status: to };
    next = startSLAIfNeeded(next, to);
    return { next };
}
