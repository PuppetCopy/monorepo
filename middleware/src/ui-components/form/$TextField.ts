import { type Behavior, O } from "aelea/core";
import {
	$element,
	$text,
	type NodeComposeFn,
	attrBehavior,
	component,
	style,
	stylePseudo,
} from "aelea/dom";
import { $row, spacing } from "aelea/ui-components";
import { colorAlpha, pallete } from "aelea/ui-components-theme";
import { empty, map } from "@most/core";
import type { Stream } from "@most/types";
import { streamOf } from "../../utils/index.js";
import { $Field, type Field } from "./$Field.js";

export const $defaultTextFieldContainer = $element("label")(
	spacing.small,
	style({
		width: "100%",
		cursor: "pointer",
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		color: pallete.foreground,
	}),
);

export const $labelDisplay = $text(
	style({
		paddingRight: "4px",
		alignSelf: "flex-end",
		cursor: "pointer",
		lineHeight: "42px",
		borderBottom: `2px solid ${colorAlpha(pallete.message, 0.1)}`,
	}),
);

const overideInputStyle = O(
	style({
		backgroundColor: pallete.background,
		color: pallete.message,
		lineHeight: "42px",
		height: "42px",
		padding: "0 8px",
	}),
	stylePseudo("::placeholder", {
		color: colorAlpha(pallete.foreground, 0.8),
	}),
);

export interface ITextField extends Field {
	label: string;
	hint?: string | Stream<string>;
	placeholder?: string | Stream<string>;

	$container?: NodeComposeFn<any, HTMLLabelElement>;
	labelWidth?: number;
}

export const $FieldLabeled = ({
	label,
	placeholder,
	hint,
	labelWidth,
	$container = $defaultTextFieldContainer,
}: ITextField) =>
	component(([change, sampleValue]: Behavior<string, string>) => {
		const $field = overideInputStyle(
			$Field({})({
				change: sampleValue(),
			}),
		);

		return [
			$container(
				$row(spacing.small, style({ width: "100%" }))(
					$labelDisplay(style({ width: labelWidth ? `${labelWidth}px` : "" }))(
						label,
					),
					attrBehavior(
						map((placeholder) => ({ placeholder }), streamOf(placeholder)),
						$field,
					),
				),
				$row(style({ position: "relative" }))(
					hint
						? $text(
								style({
									fontSize: ".85rem",
									width: "100%",
									whiteSpace: "pre-wrap",
								}),
							)(hint)
						: empty(),
				),
			),

			{ change },
		];
	});
